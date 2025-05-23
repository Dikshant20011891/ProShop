import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'; // Ensure Link is a named import
import { addToCart,removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Image, ListGroup, Row, Form, Card } from 'react-bootstrap';
import Message from '../components/Message'; // Ensure Message is correctly imported

const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const qty = location.search ? Number(new URLSearchParams(location.search).get('qty')) : 1;

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Ensure useNavigate is imported from react-router-dom
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, qty));
        }
    }, [dispatch, id, qty]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };


    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant="info" children={"Your Cart is Empty"} />
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(addToCart(item.product, e.target.value))
                                            }
                                        >
                                            {[...Array(item.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => removeFromCartHandler(item.product)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                            </h2>
                            $
                            {cartItems
                                .reduce((acc, item) => acc + item.price * item.qty, 0)
                                .toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                             < Button
                                type="button"
                                className="btn-block"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default CartScreen;
