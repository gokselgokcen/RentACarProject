namespace RentACarApi.Models
{
    public class Rental
    {
        public int Id { get; set; }
        public Car? Car { get; set; }

        public int CarId { get; set; }

        public User? User { get; set; } // Assuming you have a User entity

        public int UserId { get; set; } // Assuming you have a User entity
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }

        // Navigation property


    }
}