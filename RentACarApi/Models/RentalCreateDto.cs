public class RentalCreateDto
{
    public int CarId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
// This DTO is used to create a new rental record.