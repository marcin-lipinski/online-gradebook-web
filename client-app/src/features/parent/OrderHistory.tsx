import { Grid, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store"
import {useEffect} from 'react';
import { observer } from "mobx-react-lite";

interface Props {
    parentId: string
}

export default observer (function OrderHistory({parentId}: Props) {
    const {paymentStore} = useStore();
    const {loadingOrders, loadParentOrders, orders} = paymentStore;

    useEffect(() => {
        loadParentOrders(parentId);
    }, [loadParentOrders, parentId])

    return (           
        <Segment style={{border: "none"}} basic >
            {loadingOrders ? (<LoadingComponent content="Trwa ładowanie..." />) : 
                (
                    <>
                        {orders.length > 0 ? (<Header as='h3' content="Twoje zamówienia" textAlign="center"/>) : (<Header as='h3' content="Brak zamówień" textAlign="center"/>)}
                        {orders.map((order, index) => (
                            <Grid key={index} style={{backgroundColor: "rgb(239, 247, 221)", marginTop: "10px", marginBottom: "10px", borderRadius: "20px", padding: "10px 2px 10px 2px"}}>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as='h4' content={"Data zamówienia: "}/>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Header textAlign="left" as='h4' style={{fontWeight: "normal"}} content={`${order.orderCreateDate.slice(0, 10)}`}/>
                                    </Grid.Column>                          
                                </Grid.Row>
                                <Grid.Row style={{padding: "0px"}}>
                                    <Grid.Column>
                                        <Header as='h4' content="Produkty:"/>
                                    </Grid.Column>
                                </Grid.Row >                       
                                {order.products.map((product, index) => (
                                    <>
                                        <Grid.Row key={index} style={{marginBottom: "0px", padding: "0px"}}>
                                            <Grid.Column width={6}>
                                                <Header as='h4' style={{fontWeight: "bold"}} content={`Nazwa:`} />
                                            </Grid.Column>
                                            <Grid.Column width={10}>
                                                <Header textAlign="left" as='h4' style={{fontWeight: "normal"}} content={`${product.name}`} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row style={{marginBottom: "0px", padding: "0px"}}>
                                            <Grid.Column width={6}>
                                                <Header as='h4' style={{fontWeight: "bold"}} content={`Ilość:`} />
                                            </Grid.Column>
                                            <Grid.Column width={10}>
                                                <Header as='h4' style={{fontWeight: "normal"}} content={`${product.quantity}`} />
                                            </Grid.Column>
                                        </Grid.Row >
                                        <Grid.Row style={{marginBottom: "0px", padding: "0px"}}>
                                            <Grid.Column width={6}>
                                                <Header as='h4' style={{fontWeight: "bold"}} content={`Cena:`} />
                                            </Grid.Column >
                                            <Grid.Column width={10}>
                                                <Header as='h4' style={{fontWeight: "normal"}} content={`${Number.parseFloat(product.unitPrice) * Number.parseFloat(product.quantity)/100} zł`} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row></Grid.Row>
                                    </>
                                ))}
                                <Grid.Row style={{padding: "0px"}}>
                                    <Grid.Column width={8}>
                                        <Header as='h4' style={{fontWeight: "bold"}} content={`Łączna cena:`} />
                                    </Grid.Column>
                                    <Grid.Column  width={8}>
                                        <Header as='h4' style={{fontWeight: "normal"}} content={`${Number.parseFloat(order.totalAmount)/100} zł`} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{marginBottom: "0px", padding: "0px"}}>
                                    <Grid.Column  width={8}>
                                        <Header as='h4' style={{fontWeight: "bold"}} content={`Status:`} />
                                    </Grid.Column>
                                    <Grid.Column  width={8}>
                                        <Header as='h4' style={{fontWeight: "normal"}} content={`${order.status === "COMPLETED" ? "Opłacone" : "Nieopłacone"}`} />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        ))}
                    </>
                )
            }
        </Segment>
    )
})