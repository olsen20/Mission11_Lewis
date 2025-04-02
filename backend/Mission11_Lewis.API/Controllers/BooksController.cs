using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Lewis.API.Data;

namespace Mission11_Lewis.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BooksController(BookDbContext temp) => _bookContext = temp;


        // Request to get all books in the database
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "none", [FromQuery] List<string>? categories = null) {

            try
            {
                var query = _bookContext.Books.AsQueryable();

                // Filter based on category
                if (categories != null && categories.Any())
                {
                    query = query.Where(c => categories.Contains(c.Category));
                }

                // Configure sorting
                if (sortOrder == "asc")
                {
                    query = query.OrderBy(b => b.Title);
                }
                else if (sortOrder == "desc")
                {
                    query = query.OrderByDescending(b => b.Title);
                }

                // Return all books in list format
                var books = query
                    .Skip((pageNum - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                // Get the total number of books
                var totalBooks = query.Count();

                // Create object to send to the frontend
                var dataObject = new
                {
                    Books = books,
                    totalNumBooks = totalBooks,
                };

                return Ok(dataObject);

            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception occurred!");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return StatusCode(500, new
                {
                    message = "Server error",
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    cwd = Directory.GetCurrentDirectory(),
                    sqliteExists = System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "Bookstore.sqlite"))
                });
            }
        }


        // Request to get categories to use as a page filter
        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(c => c.Category)
                .Distinct()
                .ToList();

            return Ok(categories);
        }


        // Add a book to the database
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        // Update a book in the database
        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateBook(int bookID, [FromBody] Book updatedBook)
        {
            // Get the existing book from the database
            var existingBook = _bookContext.Books.Find(bookID);

            // Update the book with the new information
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            // Apply changes to the database
            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }


        // Delete a book from the database
        [HttpDelete("DeleteBook/{bookID}")]
        public IActionResult DeleteBook(int bookID)
        {
            // Locate desired book
            var book = _bookContext.Books.Find(bookID);

            // Ensure book exists
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            // Delete book from the database
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
