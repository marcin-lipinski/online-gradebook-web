using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public class BaseUser
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}