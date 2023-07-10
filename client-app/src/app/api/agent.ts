import axios, { AxiosError, AxiosResponse } from "axios";
import { Division } from "../models/division";
import { toast } from "react-toastify";
import { User, UserFormValues } from "../models/user";
import { Student } from "../models/student";
import { store } from "../stores/store";
import { router } from "../router/Routes";
import { Grade } from "../models/grade";
import { Subject } from "../models/subject";
import { Parent } from "../models/parent";
import { DivisionSubject } from "../models/divisonSubject";
import { Teacher } from "../models/teacher";
import { IOrder } from "../stores/paymentStore";
import { DivisionSubject2 } from "../stores/divisionSubjectsStore";
import { Order } from "../models/order";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(
    async (response) => {
        return response;
    },
    (error: AxiosError) => {
        const { data, status, config } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                if (
                    config.method === `get` &&
                    data.errors.hasOwnProperty(`id`)
                ) {
                    router.navigate(`/notfound`);
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error(`unauthorized`);
                break;
            case 403:
                toast.error(`forbidden`);
                break;
            case 404:
                router.navigate(`/notfound`);
                break;
            case 500:
                store.commonStore.setServerError(data.error);
                router.navigate(`servererror`);
                break;
        }
        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
        axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) =>
        axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Divisions = {
    list: () => requests.get<Division[]>(`/divisions`),
    listByTeacherId: (teacherId: string) => requests.get<DivisionSubject[]>(`/divisions/byteacherid/${teacherId}`),
    create: (division: Division) => requests.post<void>("/divisions", division),
    update: (division: Division) => requests.put<void>(`/divisions/${division.id}`, division),
    delete: (id: string) => requests.del<void>(`/divisions/${id}`),
};

const Parents = {
    list: () => requests.get<Parent[]>(`/parents`),
    create: (parent: Parent) => requests.post<void>("/parents", parent),
    update: (parent: Parent) => requests.put<void>(`/parents/${parent.id}`, parent),
    delete: (id: string) => requests.del<void>(`/parents/${id}`),
};

const Account = {
    current: () => requests.get<User>("/account"),
    login: (user: UserFormValues) => requests.post<User>("/account/login", user),
    register: (user: UserFormValues) => requests.post<User>("/account/register", user),
};

const Students = {
    list: () => requests.get<Student[]>(`/students`),
    listByDivisionId: (divisionId: string) => requests.get<Student[]>(`/students/bydivisionid/${divisionId}`),
    detailed: (studentId: string) => requests.get<Student>(`/students/details/${studentId}`),
    create: (student: Student) => requests.post<void>(`/students`, student),
    update: (student: Student) => requests.put<void>(`/students/${student.id}`, student),
    delete: (id: string) => requests.del<void>(`/students/${id}`),
};

const Grades = {
    listByStudentId: (studentId: string) => requests.get<Grade[]>(`grades/bystudentid/${studentId}`),
    listByDivisionSubjectId: (divisionId: string) => requests.get<{ [key: string]: Grade[] }>( `/grades/bydivisionsubjectid/${divisionId}`),
    create: (grade: Grade) => axios.post<void>(`/grades/one`, grade),
    delete: (id: string) => axios.delete<void>(`/grades/${id}`),
    createMany: (grades: Grade[]) => axios.post<void>(`/grades/many`, grades),
};

const Subjects = {
    list: () => requests.get<Subject[]>(`/subjects/list`),
    listByStudentId: (studentId: string) => requests.get<Subject[]>(`/subjects/bystudentid/${studentId}`),
    create: (subject: Subject) => requests.post<void>(`/subjects`, subject),
    update: (subject: Subject) => requests.put<void>(`/subjects/${subject.id}`, subject),
    delete: (id: string) => requests.del<void>(`/subjects/${id}`),
};

const Teachers = {
    list: () => requests.get<Teacher[]>(`/teachers/list`),
    create: (teacher: Teacher) => requests.post<void>(`/teachers`, teacher),
    update: (teacher: Teacher) => requests.put<void>(`/teachers/${teacher.id}`, teacher),
    delete: (id: string) => requests.del<void>(`/teachers/${id}`)
};

const PayU = {
    pay: (order: IOrder, parentId: string) => requests.post<string>(`/payu/${parentId}`, order),
    list: (parentId: string) => requests.get<Order[]>(`/payu/${parentId}`)
};

const DivisionSubjects = {
    listByDivisionId: (divisionId: string) => requests.get<DivisionSubject2[]>(`/divisionsubjects/${divisionId}`),
    create: (division: DivisionSubject2) =>requests.post<void>(`/divisionsubjects`, division),
    delete: (id: string) => requests.del<void>(`/divisionsubjects/${id}`),
    update: (ds: DivisionSubject2) => requests.put<void>(`/divisionSubjects/${ds.id}`, ds) 
};

const agents = {
    Divisions,
    Account,
    Students,
    Grades,
    Subjects,
    Teachers,
    Parents,
    PayU,
    DivisionSubjects
};

export default agents;
