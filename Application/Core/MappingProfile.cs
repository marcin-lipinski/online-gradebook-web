using Application.DTOs;
using Application.PayU;
using Application.PayU.RetrieveRequest;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Student, StudentDTO>()
                .ForMember(x => x.Name, o => o.MapFrom(s => s.AppUser.Name))
                .ForMember(x => x.Surname, o => o.MapFrom(s => s.AppUser.Surname))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.AppUserId))
                .ForMember(x => x.DivisionId, o => o.MapFrom(s => s.DivisionId.ToString().ToLower()));

            CreateMap<Teacher, TeacherDTO>()
                .ForMember(x => x.Name, o => o.MapFrom(s => s.AppUser.Name))
                .ForMember(x => x.Surname, o => o.MapFrom(s => s.AppUser.Surname))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.AppUserId));

            CreateMap<Division, Division>();

            CreateMap<Division, DivisionDTO>();

            CreateMap<Subject, SubjectDTO>();

            CreateMap<Grade, GradeDTO>()
                .ForMember(x => x.Subject, o => o.MapFrom(s => s.DivisionSubject.Subject.Name))
                .ForMember(x => x.Teacher, o => o.MapFrom(s => s.DivisionSubject.Teacher.AppUser.Name + " " + s.DivisionSubject.Teacher.AppUser.Surname));

            CreateMap<DivisionSubject, DivisionSubjectDTO>()
                .ForMember(ds => ds.StudentList, o => o.MapFrom(s => s.Division.Students))
                .ForMember(ds => ds.DivisionName, o => o.MapFrom(s => s.Division.Name))
                .ForMember(dest => dest.SubjectName, o => o.MapFrom(s => s.Subject.Name));

            CreateMap<SubjectDTO, Subject>();

            CreateMap<Parent, ParentDTO>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.AppUserId))
                .ForMember(x => x.Name, o => o.MapFrom(s => s.AppUser.Name))
                .ForMember(x => x.Surname, o => o.MapFrom(s => s.AppUser.Surname))
                .ForMember(x => x.StudentId, o => o.MapFrom(s => s.Student.AppUserId));

            CreateMap<BuyerDTO, Buyer>();

            CreateMap<PayUOrderDTO, PayUOrder>();

            CreateMap<DivisionSubject, DivisionSubjects.DivisionSubjectsDTO>()
                .ForMember(x => x.TeacherName, o => o.MapFrom(y => y.Teacher.AppUser.Name + " " + y.Teacher.AppUser.Surname))
                .ForMember(dest => dest.SubjectName, o => o.MapFrom(s => s.Subject.Name));

            CreateMap<PayU.RetrieveRequest.Product, PayU.RetrieveRequest.Product>();

            CreateMap<RetrieveRequest, OrderDTO>()
                .ForMember(x => x.orderCreateDate, o => o.MapFrom(s => s.orders[0].orderCreateDate))
                .ForMember(x => x.status, o => o.MapFrom(s => s.orders[0].status))
                .ForMember(x => x.products, o => o.MapFrom(s => s.orders[0].products))
                .ForMember(x => x.TotalAmount, o => o.MapFrom(s => s.orders[0].totalAmount)); 
        }

    }
}