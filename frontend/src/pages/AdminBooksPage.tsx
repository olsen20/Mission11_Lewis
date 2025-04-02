import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { deleteBook, fetchBooks } from "../api/BooksAPI";
import Pagination from "../components/Pagination";
import NewBookForm from "../components/AddBookForm";
import EditBookForm from "../components/EditBookForm";

const AdminBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const sortOrder = "none";
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    // Retrieve books from the API
    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchBooks(pageSize, pageNum, sortOrder, []);
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
        loadBooks();
    }, [pageSize, pageNum]);

    // Function to handle book deletion
    const handleDelete = async (bookID: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (!confirmDelete) return;

        try {
            await deleteBook(bookID);
            setBooks(books.filter((b) => b.bookID !== bookID));
        } catch (error) {
            alert('Failed to delete book. Please try again.');
        }
    };

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <h1>Manage Books</h1>

            {/* Add book form */}
            {!showForm && (
                <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>Add Book</button>
            )}
            {showForm && (
                <NewBookForm
                    onSuccess={() => {
                        setShowForm(false);
                        fetchBooks(pageSize, pageNum, sortOrder, []).then((data) => 
                            setBooks(data.books)
                        );
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Edit book form */}
            {editingBook && (
                <EditBookForm
                    book={editingBook}
                    onSuccess={() => {
                        setEditingBook(null);
                        fetchBooks(pageSize, pageNum, sortOrder, []).then((data) =>
                            setBooks(data.books)
                        );
                    }}
                    onCancel={() => setEditingBook(null)}
                />
            )}

            {/* Table of Books in the database */}
            <table>
                <thead>
                    <th>Book ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Publisher</th>
                    <th>ISBN</th>
                    <th>Classification</th>
                    <th>Category</th>
                    <th>Page Count</th>
                    <th>Price</th>
                </thead>
                <tbody>
                    {books.map((b) => (
                        <tr key={b.bookID}>
                            <td>{b.bookID}</td>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.publisher}</td>
                            <td>{b.isbn}</td>
                            <td>{b.classification}</td>
                            <td>{b.category}</td>
                            <td>{b.pageCount}</td>
                            <td>{b.price}</td>

                            {/* Edit button */}
                            <td>
                                <button className="btn btn-primary btn-sm w-100 mb-1" onClick={() => setEditingBook(b)}>Edit</button>
                            </td>

                            {/* Delete button */}
                            <td>
                                <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(b.bookID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Page selection and navigation */}
            <Pagination 
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setPageNum(1);
                }}
            />
        </>
    )
};

export default AdminBooksPage;

