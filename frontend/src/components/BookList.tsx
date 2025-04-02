import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from "./Pagination";

function BookList({selectedCategories}: {selectedCategories: string[]}) {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Pull books from the API
    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                const data = await fetchBooks(pageSize, pageNum, sortOrder, selectedCategories);
                setBooks(data.books);
                setTotalItems(data.totalNumBooks);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
    
        loadBooks();
    }, [pageSize, pageNum, sortOrder, selectedCategories]);

    // Update totalPages after totalItems is loaded
    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / pageSize));
    }, [totalItems, pageSize, selectedCategories]);

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {/* Dropdown for sorting */}
            <label>
                Sort by Title:
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value as "asc" | "desc" | "none");
                        setPageNum(1);
                    }}
                    
                >
                    <option value="none"></option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>


            {/* List of Books */}
            <br /><br />
            {books.map((b) => (
                <div id="bookCard" className="card" key={b.bookID}>
                    <h3 className="card-title">{b.title}</h3>
                    <ul className="list-unstyled">
                        <li><strong>Author:</strong> {b.author}</li>
                        <li><strong>Publisher:</strong> {b.publisher}</li>
                        <li><strong>ISBN:</strong> {b.isbn}</li>
                        <li><strong>Classification:</strong> {b.classification}</li>
                        <li><strong>Category:</strong> {b.category}</li>
                        <li><strong>Page Count:</strong> {b.pageCount}</li>
                        <li><strong>Price:</strong> ${b.price}</li>
                    </ul>

                    {/* Buy Book Button */}
                    <button
                        className="btn btn-success"
                        onClick={() =>
                            navigate(`/buy/${b.bookID}/${b.title}/${b.price}`)
                        }
                    >
                        Buy Book
                    </button>
                </div>
            ))}

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
}

export default BookList;