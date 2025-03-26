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
                .Skip((pageNum-1) * pageSize)
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

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(c => c.Category)
                .Distinct()
                .ToList();

            return Ok(categories);
        }
    }
}
