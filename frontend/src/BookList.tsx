import { useEffect, useState } from "react";
import { Book } from "./Book";

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

    // Pull books from the API
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:5000/api/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
        };
    
    fetchBooks();
    }, [pageSize, pageNum, sortOrder]);

    // Update totalPages after totalItems is loaded
    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / pageSize));
    }, [totalItems, pageSize]);

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
                </div>
            ))}

            {/* Button to move to previous page */}
            <br />
            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
                Previous
            </button>

            {/* Buttons to select page */}
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setPageNum(i + 1)}
                    disabled={pageNum === i + 1}
                >
                    {i + 1}
                </button>
            ))}

            {/* Button to move to next page */}
            <button
                disabled={pageNum === totalPages}
                onClick={() => setPageNum(pageNum + 1)}
            >
                Next
            </button>

            {/* Button to determine how many results to display */}
            <br /><br />
            <label>
                Results per page:
                <select
                    value={pageSize}
                    onChange={(p) => {
                        setPageSize(Number(p.target.value));
                        setPageNum(1);
                    }}
                >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </label>


        </>
    )
}

export default BookList;