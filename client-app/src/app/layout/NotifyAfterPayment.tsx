import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { router } from "../router/Routes";

export default function NotifyAfterPayment() {
    const { userStore } = useStore();

    if (userStore.user) {
        if (userStore.user.userType !== 3) router.navigate('/notfound');
    } else router.navigate('/notfound');

    return (
        <Segment className="dashboardcard" textAlign="center">
            <Header as="h2">Dziękujemy za zakupy</Header>
            <Icon size="big" name="handshake outline"></Icon>
            <Header as="h3">Odbiór do dwóch tygodni w sekretariacie szkoły</Header>
            <Button color="blue" as={Link} to={`/`} >
                Powrót na stronę główną
            </Button>
        </Segment>
    );
}