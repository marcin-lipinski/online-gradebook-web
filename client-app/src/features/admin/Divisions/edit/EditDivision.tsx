import { Header, Menu, Segment } from "semantic-ui-react";
import { Division } from "../../../../app/models/division";
import {useState} from 'react';
import GeneralDashboard from "./general/GeneralDashboard";
import StudentDashboard from "./students/StudentsDashboard";
import SubjectDashboard from "./subjects/SubjectDashboard";

interface Props{
    division: Division,
    returnFunction: (r: Division | null) => void
}

export default function EditDivision({division, returnFunction}: Props) {
    const [selectedTab, setSelectedTab] = useState('general')
    const content = (tab: string) => {
        if(tab == "general") return <GeneralDashboard division={division}/>;
        if(tab == "students") return (<StudentDashboard division={division}/>);
        return (<SubjectDashboard division={division}/>)
    }


    return (
        <>
            <Header onClick={() => returnFunction(null)} style={{cursor: 'pointer', color: "rgb(64, 95, 194)"}} content="Powrót"/>
            <Menu attached='top' tabular>
                <Menu.Item
                    content="Ogólne"
                    active={selectedTab === 'general'}
                    onClick={() => setSelectedTab(('general'))}
                />
                <Menu.Item
                    content="Uczniowie"
                    active={selectedTab === 'students'}
                    onClick={() => setSelectedTab(('students'))}
                />
                <Menu.Item
                    content="Przedmioty"
                    active={selectedTab === 'subjects'}
                    onClick={() => setSelectedTab(('subjects'))}
                />
            </Menu>
            <Segment basic style={{border: "none"}}>
                {content(selectedTab)}
            </Segment>
        </>
    )
}