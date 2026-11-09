import React, { useEffect, useMemo, useState } from 'react';

const covers = [
  ['#d9e4de', '#244b3c'],
  ['#efe2d1', '#805040'],
  ['#e1e2dc', '#45504b'],
  ['#d9e7e4', '#38625f'],
  ['#f0e3c3', '#8d642e'],
  ['#e9dde0', '#784b5b'],
];

async function api(path, init = {}) {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.detail || `Server error (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    x: <path d="M18 6 6 18M6 6l12 12"/>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6m4-6v6"/></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
  };
  return <svg {...common}>{paths[name] || paths.book}</svg>;
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    function onKey(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header"><h2>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><Icon name="x" /></button></div>
        {children}
      </section>
    </div>
  );
}

function BookCover({ book, index }) {
  const [background, foreground] = covers[(Number(book.id) - 1 + covers.length) % covers.length] || covers[index % covers.length];
  return (
    <div className="book-cover" style={{ background, color: foreground }} aria-hidden="true">
      <span className="cover-caption">BookNest / Library</span>
      <span className="cover-monogram">{book.title.slice(0, 1).toUpperCase()}</span>
      <span className="cover-rule" />
      <span className="cover-footer">READ MORE</span>
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [tab, setTab] = useState('books');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [borrowName, setBorrowName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadAll() {
    try {
      const [nextBooks, nextBorrows] = await Promise.all([api('/api/books'), api('/api/borrows')]);
      setBooks(nextBooks);
      setBorrows(nextBorrows);
      setError('');
    } catch (e) { setError('Could not load the data. Check that both services are running.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadAll(); }, []);

  const activeBorrows = useMemo(() => borrows.filter((b) => b.status === 'BORROWED'), [borrows]);
  const activeByBook = useMemo(() => new Map(activeBorrows.map((b) => [b.bookId, b])), [activeBorrows]);
  const available = books.length - activeByBook.size;
  const visibleBooks = books.filter((book) => {
    const matches = `${book.title} ${book.author}`.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim());
    const isBorrowed = activeByBook.has(book.id);
    return matches && (filter === 'all' || (filter === 'available' && !isBorrowed) || (filter === 'borrowed' && isBorrowed));
  });

  async function perform(action, success) {
    setPending(true); setError(''); setNotice('');
    try { await action(); await loadAll(); setModal(null); setNotice(success); }
    catch (e) { setError(e.message || 'The operation failed.'); }
    finally { setPending(false); }
  }

  function addBook(e) {
    e.preventDefault();
    perform(() => api('/api/books', { method: 'POST', body: JSON.stringify({ title: newTitle.trim(), author: newAuthor.trim() }) }), 'Book added successfully.');
  }
  function borrowBook(e) {
    e.preventDefault();
    perform(() => api('/api/borrows', { method: 'POST', body: JSON.stringify({ bookId: modal.book.id, borrowerName: borrowName.trim() }) }), 'Book borrowed successfully.');
  }
  function returnBook(id) {
    perform(() => api(`/api/borrows/${id}/return`, { method: 'POST' }), 'Book returned successfully.');
  }
  function deleteBook(book) {
    if (activeByBook.has(book.id)) return;
    if (!window.confirm(`Delete “${book.title}”?`)) return;
    perform(() => api(`/api/books/${book.id}`, { method: 'DELETE' }), 'Book deleted successfully.');
  }
  const formatDate = (date) => date ? new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date)) : '—';

  return (
    <div className="layout">
      <aside className="sidebar">
        <a className="logo" href="/" onClick={(e) => { e.preventDefault(); setTab('books'); }}>
          <span className="logo-mark"><Icon name="book" size={21} /></span>
          <span>BookNest<span className="logo-dot">.</span></span>
        </a>
        <p className="sidebar-caption">LIBRARY MANAGEMENT</p>
        <nav className="nav-menu" aria-label="Main navigation">
          <button type="button" className={`nav-link ${tab === 'books' ? 'active' : ''}`} onClick={() => setTab('books')}><Icon name="grid" /> Books</button>
          <button type="button" className={`nav-link ${tab === 'borrows' ? 'active' : ''}`} onClick={() => setTab('borrows')}><Icon name="clock" /> Borrowings</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span className="breadcrumb">Library <span>/</span> {tab === 'books' ? 'Books' : 'Borrowings'}</span>
        </header>
        <div className="content-inner">
          <section className="page-heading">
            <div><p className="eyebrow">BOOKNEST / LIBRARY</p><h1>{tab === 'books' ? 'Book Collection' : 'Borrowing History'}</h1><p className="subtext">{tab === 'books' ? 'Browse the collection and manage book availability.' : 'View active borrowings and past returns.'}</p></div>
            {tab === 'books' && <button className="primary-button heading-action" onClick={() => { setNewTitle(''); setNewAuthor(''); setModal({ type: 'add' }); }}><Icon name="plus" size={18} /> Add Book</button>}
          </section>

          <section className="stats-grid" aria-label="Statistics">
            <div className="stat-card"><span className="stat-icon blue"><Icon name="book" /></span><p>Total Books</p><strong>{books.length}</strong><span className="stat-note">Books in the collection</span></div>
            <div className="stat-card"><span className="stat-icon green"><Icon name="check" /></span><p>Available Books</p><strong>{available}</strong><span className="stat-note">Ready to borrow</span></div>
            <div className="stat-card"><span className="stat-icon orange"><Icon name="clock" /></span><p>Borrowed Books</p><strong>{activeBorrows.length}</strong><span className="stat-note">Currently checked out</span></div>
          </section>

          {notice && <div className="alert success" role="status"><Icon name="check" size={17} /> {notice}<button onClick={() => setNotice('')} aria-label="Close"><Icon name="x" size={15}/></button></div>}
          {error && <div className="alert error" role="alert">{error}<button onClick={() => { setError(''); loadAll(); }}><Icon name="refresh" size={16}/> Retry</button></div>}

          {tab === 'books' ? (
            <section className="catalog-section">
              <div className="section-title"><div><h2>Collection</h2><p>Find a book and borrow it</p></div><span className="count-label">{visibleBooks.length} books</span></div>
              <div className="toolbar">
                <label className="search-box"><Icon name="search" size={19}/><input aria-label="Search books" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or author..." /></label>
                <div className="filter-tabs" role="group" aria-label="Filter books">
                  {[['all','All'], ['available','Available'], ['borrowed','Borrowed']].map(([key,label]) => <button key={key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{label}</button>)}
                </div>
              </div>
              {loading ? <div className="empty-state">Loading...</div> : visibleBooks.length === 0 ? <div className="empty-state">No matching books. Try a different search or select All.</div> : (
                <div className="books-grid">{visibleBooks.map((book, i) => {
                  const active = activeByBook.get(book.id);
                  return <article className="book-card" key={book.id}>
                    <BookCover book={book} index={i} />
                    <div className="book-detail"><div className="book-kicker">BOOK NO. {String(book.id).padStart(3, '0')}</div><h3 title={book.title}>{book.title}</h3><p className="author">{book.author}</p>
                      <div className="book-bottom"><span className={`status ${active ? 'borrowed' : 'available'}`}><span className="status-dot" />{active ? 'Borrowed' : 'Available'}</span></div>
                      <div className="book-actions"><button className="borrow-button" disabled={Boolean(active) || pending} onClick={() => { setBorrowName(''); setModal({ type: 'borrow', book }); }}>{active ? 'Unavailable' : 'Borrow'} <Icon name="arrow" size={16}/></button><button className="delete-button" title={active ? 'Return the book before deleting it' : 'Delete book'} disabled={Boolean(active) || pending} onClick={() => deleteBook(book)} aria-label={`${book.title} — delete`}><Icon name="trash" size={17}/></button></div>
                    </div>
                  </article>;
                })}</div>
              )}
            </section>
          ) : (
            <section className="catalog-section">
              <div className="section-title"><div><h2>Borrowing Records</h2><p>Active borrowings and returns</p></div><span className="count-label">{borrows.length} records</span></div>
              {loading ? <div className="empty-state">Loading...</div> : borrows.length === 0 ? <div className="empty-state">No borrowing records yet. Choose a book from the collection.</div> : (
                <div className="table-scroll"><table className="borrow-table"><thead><tr><th>Book</th><th>Borrower</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>{borrows.map((entry) => <tr key={entry.id}><td className="table-title">{entry.bookTitle}</td><td>{entry.borrowerName}</td><td>{formatDate(entry.borrowedAt)}</td><td><span className={`status ${entry.status === 'BORROWED' ? 'borrowed' : 'available'}`}><span className="status-dot" />{entry.status === 'BORROWED' ? 'Borrowed' : 'Returned'}</span></td><td className="table-action">{entry.status === 'BORROWED' && <button className="return-button" disabled={pending} onClick={() => returnBook(entry.id)}>Return</button>}</td></tr>)}</tbody></table></div>
              )}
            </section>
          )}
        </div>
      </main>

      {modal?.type === 'add' && <Modal title="Add a New Book" onClose={() => setModal(null)}><form className="modal-form" onSubmit={addBook}><label>Book Title<input required maxLength={150} autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. The Alchemist" /></label><label>Author<input required maxLength={100} value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="e.g. Paulo Coelho" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="primary-button" disabled={pending || !newTitle.trim() || !newAuthor.trim()}>{pending ? 'Saving...' : 'Add Book'}</button></div></form></Modal>}
      {modal?.type === 'borrow' && <Modal title="Borrow a Book" onClose={() => setModal(null)}><form className="modal-form" onSubmit={borrowBook}><div className="selected-book"><div className="small-cover"><Icon name="book" size={22}/></div><div><strong>{modal.book.title}</strong><p>{modal.book.author}</p></div></div><label>Full Name<input required maxLength={80} autoFocus value={borrowName} onChange={(e) => setBorrowName(e.target.value)} placeholder="e.g. Anna Smith" /></label><p className="modal-hint">This book will appear in Borrowings after confirmation.</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="primary-button" disabled={pending || !borrowName.trim()}>{pending ? 'Processing...' : 'Confirm Borrowing'}</button></div></form></Modal>}
    </div>
  );
}
