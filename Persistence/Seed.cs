using System.Text;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        private static readonly Random _random = new Random();
        private static List<string> surnames, names, subjectsNames, descriptions;

        public static string GenerateRandomString()
        {
            const string upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowerLetters = "abcdefghijklmnopqrstuvwxyz";
            const string numbers = "0123456789";
            const string nonalphanumeric = "!@#$%&?";

            var upLetComb = Enumerable.Repeat(upperLetters, 3).Select(s => s[_random.Next(s.Length)]);
            var loLetComb = Enumerable.Repeat(lowerLetters, 3).Select(s => s[_random.Next(s.Length)]);
            var numComb = Enumerable.Repeat(numbers, 3).Select(s => s[_random.Next(s.Length)]);
            var nonAlpha = nonalphanumeric[_random.Next(nonalphanumeric.Length)];
            return new string(upLetComb.Concat(loLetComb).Concat(numComb).Append(nonAlpha).ToArray().Shuffle());
        }

        public static Func<string> RandomName = () => names[_random.Next(names.Count)];
        public static Func<string> RandomSurname = () => surnames[_random.Next(surnames.Count)];

        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!context.Users.Any())
            {
                using(var creds = File.OpenWrite("../Persistence/credentials.txt"))
                {
                    //wczytanie imion i nazwisk
                    surnames = File.ReadAllLines("../Persistence/surnames.txt").Select(x => x.Replace(",", "")).ToList();
                    names = File.ReadAllLines("../Persistence/names.txt").Select(x => x.Replace(",", "")).ToList();    
                    subjectsNames = File.ReadAllLines("../Persistence/subjects.txt").Select(x => x.Replace(",", "")).ToList();  
                    descriptions = File.ReadAllLines("../Persistence/descriptions.txt").Select(x => x.Replace(",", "")).ToList();  
                    var gradeTypes = (GradeType[])Enum.GetValues(typeof(GradeType));        

                    var Users = new List<AppUser>();

                    // Tworzenie admina
                    var admin = new Admin();
                    var adminPassword = GenerateRandomString();
                    string adminLogin;
                    do
                    {
                        adminLogin = GenerateRandomString();
                    }while(Users.Any(u => u.Login.Equals(adminLogin)));

                    var adminAppUser = new AppUser { Name = RandomName(), Surname = RandomSurname(), Login = adminLogin, UserType = UserType.Admin };
                    await userManager.CreateAsync(adminAppUser, adminPassword);
                    Users.Add(adminAppUser);
                    admin.AppUser = adminAppUser;

                    var data = Encoding.UTF8.GetBytes("Admin " + adminAppUser.Name + " " + adminAppUser.Surname + " - " + adminLogin + ", " + adminPassword + "\n");
                    await creds.WriteAsync(data);

                    // Tworzenie nauczycieli
                    var teachers = new List<Teacher>();
                    for (int i = 1; i <= 55; i++)
                    {
                        var teacher = new Teacher();
                        var teacherPassword = GenerateRandomString();
                        string teacherLogin;
                        do
                        {
                            teacherLogin = GenerateRandomString();
                        }while(Users.Any(u => u.Login.Equals(teacherLogin)));

                        var teacherAppUser = new AppUser { Name = RandomName(), Surname = RandomSurname(), Login = teacherLogin, UserType = UserType.Teacher };
                        await userManager.CreateAsync(teacherAppUser, teacherPassword);
                        Users.Add(teacherAppUser);
                        teacher.AppUser = teacherAppUser;
                        teachers.Add(teacher);

                        data = Encoding.UTF8.GetBytes("Nauczyciel " + teacherAppUser.Name + " " + teacherAppUser.Surname + " - " + teacherLogin + ", " + teacherPassword + "\n");
                        await creds.WriteAsync(data);
                    }

                    // Tworzenie klas
                    var divisions = new List<Division>();
                    for (int i = 1; i <= 8; i++)
                    {
                        for(char j = 'A'; j <= 'D'; j++)
                        {
                            var teacher = teachers[_random.Next(teachers.Count)];
                            var division = new Division { Name = $"{i}{j}", SupervisingTeacher = teacher };
                            teacher.SupervisedDivisions.Add(division);
                            divisions.Add(division);
                        }
                    }
                    divisions.Add(new Division { Name = "Unassigned"});

                    // Tworzenie uczniów i ich rodziców
                    var students = new List<Student>();
                    foreach(var division in divisions)
                    {
                        for (int i = 1; i <= _random.Next(15, 25); i++)
                        {
                            var studentPassword = GenerateRandomString();
                            string studentLogin;
                            do
                            {
                                studentLogin = GenerateRandomString();
                            }while(Users.Any(u => u.Login.Equals(studentLogin)));
                            
                            var studentSurname = RandomSurname();
                            var appStudent = new AppUser { Name = RandomName(), Surname = studentSurname, Login = studentLogin, UserType = UserType.Student };
                            await userManager.CreateAsync(appStudent, studentPassword);
                            Users.Add(appStudent);
                            var student = new Student { Birthdate = DateTime.Now.AddYears(-15).AddDays(i), AppUser = appStudent, Division = division };

                            data = Encoding.UTF8.GetBytes("Student " + appStudent.Name + " " + appStudent.Surname + " - " + studentLogin + ", " + studentPassword + "\n");
                            await creds.WriteAsync(data);

                            var parentPassword = GenerateRandomString();
                            string parentLogin;
                            do
                            {
                                parentLogin = GenerateRandomString();
                            }while(Users.Any(u => u.Login.Equals(parentLogin)));
                            
                            var parent = new Parent();
                            var parentAppUser = new AppUser { Name = RandomName(), Surname = studentSurname, Login = parentLogin, UserType = UserType.Parent };
                            await userManager.CreateAsync(parentAppUser, parentPassword);
                            Users.Add(parentAppUser);
                            parent.AppUser = parentAppUser;
                            parent.Student = student;

                            data = Encoding.UTF8.GetBytes("Rodzic " + parentAppUser.Name + " " + parentAppUser.Surname + " - " + parentLogin + ", " + parentPassword + "\n");
                            await creds.WriteAsync(data);

                            student.Parent = parent;
                            students.Add(student);
                        }
                    }

                    var subjects = new List<Subject>();
                    foreach (var subjectName in subjectsNames)
                    {
                        var subject = new Subject { Name = subjectName };
                        subjects.Add(subject);
                    }

                    //Przypisywanie nauczycieli do przedmiotów
                    var divisionSubjects = new List<DivisionSubject>();
                    var grades = new List<Grade>();

                    foreach (var division in divisions)
                    {
                        for (int i = 0; i < _random.Next(7, subjects.Count); i++)
                        {
                            var subject = subjects[i];
                            var teacher = teachers[_random.Next(0, teachers.Count)];

                            var divisionSubject = new DivisionSubject
                            {
                                Division = division,
                                Subject = subject,
                                Teacher = teacher
                            };

                            division.DivisionSubjects.Add(divisionSubject);
                            divisionSubjects.Add(divisionSubject);

                            var studentsDev = students.Where(student => student.Division == division).ToList();
                            foreach (var student in studentsDev)
                            {
                                for (int j = 1; j <= _random.Next(1, 15); j++)
                                {
                                    var grade = new Grade { GradeType = gradeTypes[_random.Next(gradeTypes.Length)], GradeWeight = (GradeWeight)_random.Next(1, 7), Description = descriptions[_random.Next(descriptions.Count)] };
                                    grade.DivisionSubject = divisionSubject;
                                    grade.Student = student;
                                    grades.Add(grade);
                                }
                            }
                        }
                    }

                    //Dodawanie wszystkich obiektów do kontekstu i zapisywanie zmian
                    await context.Admins.AddAsync(admin);
                    await context.Teachers.AddRangeAsync(teachers);
                    await context.Subjects.AddRangeAsync(subjects);
                    await context.Divisions.AddRangeAsync(divisions);
                    await context.Parents.AddRangeAsync(students.Select(s => s.Parent));
                    await context.Students.AddRangeAsync(students);
                    await context.Grades.AddRangeAsync(grades);
                    await context.DivisionSubjects.AddRangeAsync(divisionSubjects);

                    await context.SaveChangesAsync();
                }
            }
        }
    }

    public static class CharArrayExtensions
    {
        private static readonly Random _random = new Random();
        public static char[] Shuffle(this char[] array)
        {
            for (int i = array.Length - 1; i > 0; i--)
            {
                int j = _random.Next(i + 1);
                char temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }
}