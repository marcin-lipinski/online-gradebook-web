import { makeAutoObservable, runInAction } from 'mobx';
import { Grade } from '../models/grade';
import { v4 as uuid } from 'uuid';
import agents from '../api/agent';

export default class GradesStore {
    gradesRegistry = new Array<Grade>();
    gradesDivisionSubject: Map<string, Grade[][]> = new Map<
        string,
        Grade[][]
    >();
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    gradeTypeToNumber = (gradeType: number) => {
        const grade = (gradeType / 100).toString().split('.');
        if (grade[1] == null) return grade[0];
        if (grade[1] == '5') return grade[0] + '+';
        return Math.ceil(gradeType / 100) + '-';
    };

    gradeWeightToNumber = (gradeWeight: number) => {
        switch (gradeWeight) {
            case 1:
                return 'rgb(202, 231, 185)';
            case 2:
                return 'rgb(117, 193, 73)';
            case 3:
                return 'rgb(239, 213, 107)';
            case 4:
                return 'rgb(222, 182, 23)';
            case 5:
                return 'rgb(229, 115, 97)';
            case 6:
                return 'rgb(221, 68, 44)';
        }
    };

    get gradesBySubject() {
        let bySubject = new Map<string, Grade[]>();

        this.gradesRegistry.forEach((grade) =>
            bySubject.has(grade.subject)
                ? bySubject.get(grade.subject)?.push(grade)
                : bySubject.set(grade.subject, [grade])
        );

        let subGroupsBySubject = new Map<string, Grade[][]>();
        bySubject.forEach((grades, subject) => {
            let temp = [];
            while (grades.length) temp.push(grades.splice(0, 10));
            subGroupsBySubject.set(subject, temp);
        });

        return subGroupsBySubject;
    }

    loadGradesOfStudent = async (id: string) => {
        this.loading = true;
        try {
            const grades = await agents.Grades.listByStudentId(id);
            runInAction(() => (this.gradesRegistry = grades));
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    };

    GradesByStudentId(grades: { [key: string]: Grade[] }) {
        const asMap: Map<string, Grade[]> = new Map(Object.entries(grades));
        const result: Map<string, Grade[][]> = new Map<string, Grade[][]>();
        Array.from(asMap.keys()).forEach((key) => {
            const temp: Grade[][] = [];
            while (asMap.get(key)!.length) {
                temp.push(asMap.get(key)!.splice(0, 10));
            }
            result.set(key, temp);
        });

        this.gradesDivisionSubject = result;
        this.loading = false;
    }

    loadGradesByDivisionAndSubject = async (divisionSubjectId: string) => {
        this.loading = true;
        try {
            const grades = await agents.Grades.listByDivisionSubjectId(divisionSubjectId);
            runInAction(() => {
                this.GradesByStudentId(grades);
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    addGrade = async (grade: Grade, teacherName: string) => {
        this.loading = true;
        grade.id = uuid();
        try {
            await agents.Grades.create(grade);
            grade.teacher = teacherName;
            runInAction(() => {
                this.gradesDivisionSubject
                    .get(grade.studentId)
                    ?.at(
                        this.gradesDivisionSubject.get(grade.studentId)!
                            .length - 1
                    )
                    ?.push(grade);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.loading = false));
        }
    };

    addManyGrades = async (grades: Array<Grade>) => {
        this.loading = true;
        grades.forEach((x) => (x.id = uuid()));
        try {
            await agents.Grades.createMany(grades);
            runInAction(() => {
                grades.forEach((grade) =>
                    this.gradesDivisionSubject
                        .get(grade.studentId)
                        ?.at(
                            this.gradesDivisionSubject.get(grade.studentId)!
                                .length - 1
                        )
                        ?.push(grade)
                );
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.loading = false));
        }
    };

    deleteGrade = async (studentId: string, gradeId: string) => {
        this.loading = true;
        try {
            await agents.Grades.delete(gradeId);
            runInAction(() => {
                this.gradesDivisionSubject.set(
                    studentId,
                    this.gradesDivisionSubject
                        .get(studentId)
                        ?.map((gr) => gr.filter((g) => g.id != gradeId))!
                );
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };
}
