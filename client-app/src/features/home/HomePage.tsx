import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoginForm from '../user/LoginForm';

export default observer(function HomePage() {
    const { userStore } = useStore();

    return (
        <Segment inverted textAlign="center" vertical className="masterhead">
            <Container text className="centerhead">
                <Header as="h1" inverted className="headermain">
                    <Image
                        style={{
                            width: '15%',
                            height: 'auto',
                            marginBottom: 15,
                        }}
                        src="assets/logo.png"
                        alt="logo"
                    />{' '}
                    Perkins
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header
                            as="h2"
                            inverted
                            content={`Jesteś zalogowany jako ${
                                userStore.user!.name +
                                ' ' +
                                userStore.user!.surname +
                                ' - ' +
                                userStore.userTypeAsString()
                            }`}
                        />
                        <Button
                            style={{ marginTop: '30px' }}
                            onClick={userStore.goToCorrectDashboard}
                            size="huge"
                            inverted
                            content="Wejdz do Perkinsa"
                        />
                    </>
                ) : (
                    <Container style={{ width: '40%' }}>
                        <Header
                            as="h2"
                            inverted
                            className="headermain"
                            content="Zaloguj się"
                        />
                        <LoginForm />
                    </Container>
                )}
            </Container>
        </Segment>
    );
});
