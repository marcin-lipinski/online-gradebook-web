import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';

interface Props {
    gradeId: string;
    studentId: string;
}

export default observer(function DeleteGrade({ studentId, gradeId }: Props) {
    const { modalStore, gradesStore } = useStore();
    const { deleteGrade } = gradesStore;

    function deleteGradeAndClose() {
        modalStore.closeModal();
        deleteGrade(studentId, gradeId);
    }

    if (gradesStore.loading)
        return <LoadingComponent content="Trwa usuwanie oceny..." />;

    return (
        <>
            <Header textAlign='center'>Usunąć tę ocenę?</Header>
            <Table style={{border: "none"}}>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell textAlign='center'>
                            <Button inverted color="green" onClick={() => deleteGradeAndClose()}>Tak</Button>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Button inverted color='red' onClick={() => modalStore.closeModal()}>Nie</Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    );
});
