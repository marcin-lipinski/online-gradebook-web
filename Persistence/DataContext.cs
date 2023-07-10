using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Division> Divisions { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<DivisionSubject> DivisionSubjects { get; set; }
         public DbSet<Order> Orders { get; set; }
        public DataContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Admin
            modelBuilder.Entity<Admin>().HasKey(a => a.AppUserId);
            modelBuilder.Entity<Admin>().HasOne(a => a.AppUser).WithOne().HasForeignKey<Admin>(t => t.AppUserId);

            //Teacher
            modelBuilder.Entity<Teacher>().HasKey(t => t.AppUserId);
            modelBuilder.Entity<Teacher>().HasOne(t => t.AppUser).WithOne().HasForeignKey<Teacher>(t => t.AppUserId);
            modelBuilder.Entity<Teacher>().HasMany(t => t.DivisionSubjects).WithOne(s => s.Teacher).HasForeignKey(s => s.TeacherId);
            modelBuilder.Entity<Teacher>().HasMany(t => t.SupervisedDivisions).WithOne(sd => sd.SupervisingTeacher).OnDelete(DeleteBehavior.Restrict);

            //Parent
            modelBuilder.Entity<Parent>().HasKey(p => p.AppUserId);
            modelBuilder.Entity<Parent>().HasOne(p => p.AppUser).WithOne().HasForeignKey<Parent>(t => t.AppUserId);
            modelBuilder.Entity<Parent>().HasOne(p => p.Student).WithOne(s => s.Parent).HasForeignKey<Parent>(s => s.StudentId);
            modelBuilder.Entity<Parent>().HasMany(p => p.Orders).WithOne(o => o.Parent).HasForeignKey(o => o.ParentId).OnDelete(DeleteBehavior.Cascade);

            //Student
            modelBuilder.Entity<Student>().HasKey(s => s.AppUserId);
            modelBuilder.Entity<Student>().HasOne(t => t.AppUser).WithOne().HasForeignKey<Student>(t => t.AppUserId);
            modelBuilder.Entity<Student>().HasOne(s => s.Division).WithMany(d => d.Students).HasForeignKey(p => p.DivisionId);

            //Grade
            modelBuilder.Entity<Grade>().HasOne(g => g.Student).WithMany(s => s.Grades).HasForeignKey(g => g.StudentId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Grade>().HasOne(g => g.DivisionSubject).WithMany(d => d.Grades).HasForeignKey(g => g.DivisionSubjectId).OnDelete(DeleteBehavior.Restrict);

            //Division
            modelBuilder.Entity<Division>().HasMany(d => d.Students).WithOne(s => s.Division).HasForeignKey(s => s.DivisionId);
            modelBuilder.Entity<Division>().HasMany(d => d.DivisionSubjects).WithOne(s => s.Division).HasForeignKey(s => s.DivisionId);
            modelBuilder.Entity<Division>().HasOne(sd => sd.SupervisingTeacher).WithMany(t => t.SupervisedDivisions).HasForeignKey(sd => sd.SupervisingTeacherId).OnDelete(DeleteBehavior.Restrict);;

            //DivisionSubject
            modelBuilder.Entity<DivisionSubject>().HasOne(d => d.Division).WithMany(d => d.DivisionSubjects).HasForeignKey(d => d.DivisionId);
            modelBuilder.Entity<DivisionSubject>().HasOne(d => d.Teacher).WithMany(t => t.DivisionSubjects).HasForeignKey(d => d.TeacherId);
            modelBuilder.Entity<DivisionSubject>().HasOne(d => d.Subject).WithMany(s => s.divisionSubjects).HasForeignKey(p => p.SubjectId);
            modelBuilder.Entity<DivisionSubject>().HasMany(d => d.Grades).WithOne(g => g.DivisionSubject).OnDelete(DeleteBehavior.Cascade);

            //Order
            modelBuilder.Entity<Order>().HasKey(o => o.Id);
            modelBuilder.Entity<Order>().HasOne(o => o.Parent).WithMany(p => p.Orders);
        }
    }
}
