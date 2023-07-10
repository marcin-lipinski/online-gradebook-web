import { Button, Header, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../../../app/layout/LoadingComponent';
import { useStore } from '../../../../../app/stores/store';
import { DivisionSubject2 } from '../../../../../app/stores/divisionSubjectsStore';

interface Props {
    subject: DivisionSubject2;
}

export default observer(function DeleteSubject({ subject }: Props) {
    const { modalStore, subjectStore, divisionSubjectStore } = useStore();
    const { deleteDivisionSubject } = divisionSubjectStore;

    const deleteSubjectAndClose = async () => {
        await deleteDivisionSubject(subject.id);
    };

    if (subjectStore.loading) return <LoadingComponent content="Trwa usuwanie przedmiotu z tej klasy..." />;

    return (
        <>
            <Header textAlign="center">Usunąć ten przedmiot?</Header>
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell textAlign='center' width={6}>
                        <Button className='confirm-button' onClick={() => {modalStore.closeModal(); deleteSubjectAndClose()}}>Tak</Button>
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
