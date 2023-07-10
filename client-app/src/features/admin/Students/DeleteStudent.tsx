import { Button, Header, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface Props {
    studentId: string;
}

export default observer(function DeleteStudent({ studentId }: Props) {
    const { modalStore, studentsStore, parentsStore } = useStore();
    const { deleteStudent } = studentsStore;

    function deleteStudentAndClose() {
        modalStore.closeModal();
        deleteStudent(studentId).then(() => {
            var temp2 = parentsStore.parents.filter(x => x.studentId !== studentId);
            parentsStore.parents = temp2;
        });        
    }

    if (studentsStore.loading)
        return <LoadingComponent content="Trwa usuwanie ucznia..." />;

    return (
        <>
            <Header textAlign="center">Usunąć tego ucznia?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='confirm-button' onClick={() => deleteStudentAndClose()}>Tak</Button>
                    </Table.Cell>
                    <Table.Cell width={1}></Table.Cell>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='remove-button' onClick={() => modalStore.closeModal()}>Nie</Button>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </>
    );
});
