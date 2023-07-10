import { Button, Header, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface Props {
    teacherId: string;
}

export default observer(function DeleteTeacher({ teacherId }: Props) {
    const { modalStore, teacherStore } = useStore();
    const { deleteTeacher } = teacherStore;

    function deleteTeacherAndClose() {
        modalStore.closeModal();
        deleteTeacher(teacherId);
    }

    if (teacherStore.loading)
        return <LoadingComponent content="Trwa usuwanie nauczyciela..." />;

    return (
        <>
            <Header textAlign="center">Usunąć tego nauczyciela?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='confirm-button' onClick={() => deleteTeacherAndClose()}>Tak</Button>
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
