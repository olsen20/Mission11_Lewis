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
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "none") {

            // Configure sorting
            var query = _bookContext.Books.AsQueryable();
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
                .Skip((pageNum-1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Get the total number of books
            var totalBooks = _bookContext.Books.Count();

            // Create object to send to the frontend
            var dataObject = new
            {
                Books = books,
                totalNumBooks = totalBooks,
            };

            return Ok(dataObject);
        }
    }
}
