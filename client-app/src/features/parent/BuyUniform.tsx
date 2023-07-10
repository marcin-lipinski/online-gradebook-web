import { Button, Card, Container, Divider, Grid, Header, Icon, Image, Table, TableCell} from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { useState, useEffect } from 'react';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'react-router-dom';
import MySelectInput from '../../app/common/form/MySelectInput';
import { uniformAmmount, uniformSize } from '../../app/common/options/uniformOrder';
import ValidationError from '../teacher/ValidationError';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../app/layout/LoadingComponent';
import MyTextInput from '../../app/common/form/MyTextInput';
import OrderHistory from './OrderHistory';

interface orderItem {
    name: string;
    unitPrice?: number;
    size?: string;
    quantity: number;
    errors: null;
}

export default observer(function BuyUniform() {
    const { userStore, paymentStore, divisionStore, modalStore } = useStore();
    const [ip, setIp] = useState('');
    const [orderList, setOrderList] = useState<orderItem[]>([]);
    const [divisionsList, setDivisionsList] = useState<{ text: string; value: string }[]>([]);
    const [payable, setPayable] = useState(false);

    const fetchIPAddress = async () => {
        try {
            fetch('https://api.ipify.org?format=json')
                .then((response) => response.json())
                .then((data) => {setIp(data.ip);
            })
            .catch((error) => {});
        }catch(error){}
    };

    useEffect(() => {
        fetchIPAddress();
        if (orderList.length < 1) {
            fetchIPAddress();
            const temp: { text: string; value: string }[] = [];
            divisionStore.divisions.forEach((d) => {
                temp.push({ text: d.name, value: d.name });
            });            
            temp.sort((a, b) => {
                    const charComparison = a.text.charAt(0).localeCompare(b.text.charAt(0));
                    if (charComparison !== 0) return charComparison;
                    return a.text.charAt(1).localeCompare(b.text.charAt(1));
                })
            setDivisionsList(temp);
        }
    }, [divisionStore.divisions.length, orderList.length, ip, divisionStore]);

    function addToOrderList(order: orderItem) {
        setOrderList((prevOrderList) => [...prevOrderList, order]);
        setPayable(true);
    }

    function deleteFromOrderList(indexToRemove: number) {
        orderList.splice(indexToRemove, 1)
        setPayable(orderList.length > 0);
    }

    function pay(creds: { email: string; phone: string; errors: null }) {
        const order = paymentStore.prepereOrderObject();
        order.customerIp = ip.toString();
        orderList.forEach((o, index) => {
            order.products.push({
                name: 'Mundurek szkolny ' + o.name,
                unitPrice: '8000',
                quantity: o.quantity.toString(),
            });
            order.description += `${index + 1}. Mundurek szkolny ${
                o.name
            } - rozmiar ${o.size} - ilosc ${o.quantity}. `;
        });
        let total = 0;
        orderList.forEach((o, index) => {
            total += o.quantity * 8000;
        });
        order.totalAmount = total.toString();
        order.buyer.firstName = userStore.user!.name;
        order.buyer.lastName = userStore.user!.surname;
        order.buyer.phone = creds.phone;
        order.buyer.email = creds.email;
        setOrderList([]);
        paymentStore.proceedPayment(order, userStore.user!.id);
    }

    if (paymentStore.loading) return <LoadingComponent content="Ładowanie..." />;

    return (
        <>
            <Formik
                initialValues={{
                    name: '',
                    size: '',
                    quantity: 0,
                    errors: null,
                }}
                onSubmit={(values, { setErrors }) => {
                    addToOrderList(values);
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required(),
                    size: Yup.string().required(),
                    quantity: Yup.number().min(1),
                })}
            >
                {({ handleSubmit, isValid, dirty, errors }) => (
                    <Form
                        className="ui form"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <Grid columns={3} style={{marginBottom: "-5px"}}>
                            <Grid.Column />
                            <Grid.Column verticalAlign='bottom'>
                                <Header
                                    as="h2"
                                    content="Kup mundurek"
                                    color="teal"
                                    textAlign="center"/>
                            </Grid.Column>
                            <Grid.Column >
                                <Button floated='right' className='grade-button' content='Historia zamówien' onClick={() => modalStore.openModal(<OrderHistory parentId={userStore.user!.id}/>)}/>
                            </Grid.Column>                            
                        </Grid>
                        
                        <MySelectInput
                            placeholder="Klasa"
                            name="name"
                            options={divisionsList}
                        />
                        <MySelectInput
                            placeholder="Rozmiar"
                            name="size"
                            options={uniformSize}
                        />
                        <MySelectInput
                            placeholder="Ilość"
                            name="quantity"
                            options={uniformAmmount}
                        />
                        <ErrorMessage
                            name="error"
                            render={() => (
                                <ValidationError errors={errors.errors} />
                            )}
                        />
                        <Button
                            disabled={!isValid || !dirty}
                            content="Dodaj"
                            fluid
                        />
                    </Form>
                )}
            </Formik>

            <Divider horizontal>Koszyk</Divider>

            <Grid>
                <Grid.Row>
                    {!payable ? (
                        <Table style={{ border: 'none' }}>
                            <Table.Body>
                                <Table.Row>
                                    <TableCell textAlign="center">
                                        <Icon
                                            disabled
                                            size="big"
                                            name="shopping basket"
                                        ></Icon>
                                    </TableCell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    ) : (
                        <></>
                    )}
                    {orderList.map((o, index) => (
                        <Card fluid key={index}>
                            <Table>
                                <Table.Body>
                                    <Table.Row>
                                        <TableCell
                                        width={1}
                                        textAlign="right"
                                        verticalAlign="middle"
                                        >
                                            <Header>Mundurek {o.name}</Header>
                                        </TableCell>
                                        <TableCell
                                            width={1}
                                            textAlign="center"
                                            verticalAlign="middle"
                                        >
                                            <Header as="h4">
                                                Rozmiar: {o.size!.toUpperCase()}
                                            </Header>
                                        </TableCell>
                                        <TableCell
                                            width={2}
                                            textAlign="left"
                                            verticalAlign="middle"
                                        >
                                            <Header as="h4">Ilość: {o.quantity}</Header>
                                        </TableCell>
                                        <TableCell width={4} textAlign="right">
                                            <Button
                                                onClick={() =>
                                                    deleteFromOrderList(index)
                                                }
                                                negative
                                                content="Usuń"
                                            />
                                        </TableCell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Card>
                    ))}
                </Grid.Row>

                <Container>
                    <Divider horizontal>Zapłać</Divider>
                </Container>

                <Container textAlign="center">
                    <Formik
                        initialValues={{ email: '', phone: '', errors: null }}
                        onSubmit={(values, { setErrors }) => {
                            pay(values);
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .required('Adres email jest wymagany')
                                .email('Podaj poprawny adres email'),
                            phone: Yup.string()
                                .required()
                                .matches(
                                    /^\d{9}$/,
                                    'Podaj oprawny numer telefonu'
                                ),
                        })}
                    >
                        {({ handleSubmit, isValid, dirty, errors }) => (
                            <Form
                                className="ui form"
                                onSubmit={handleSubmit}
                                autoComplete="off"
                            >
                                <Header
                                    as="h2"
                                    content="Wprowadź swoje dane"
                                    textAlign="center"
                                />
                                <Header
                                    as="h4"
                                    content="Mundurek będzie do odebrania w ciągu dwóch tygodni w sekretariacie szkoły."
                                    textAlign="center"
                                />
                                <MyTextInput
                                    placeholder="Adres email"
                                    name="email"
                                />
                                <MyTextInput
                                    placeholder="Numer telefonu"
                                    name="phone"
                                />
                                <ErrorMessage
                                    name="error"
                                    render={() => (
                                        <ValidationError
                                            errors={errors.errors}
                                        />
                                    )}
                                />
                                <Button
                                    className="hoverable payu"
                                    disabled={!isValid || !dirty || !payable}
                                    loading={paymentStore.loading}
                                    style={{ borderRadius: '30px' }}
                                >
                                    <Image
                                        size="tiny"
                                        src="assets/payu_logo.png"
                                    ></Image>
                                </Button>
                            </Form>
                        )}
                    </Formik>                    
                </Container>
            </Grid>
        </>
    );
});
