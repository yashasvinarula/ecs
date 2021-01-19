import React, { Component } from 'react';
import {connect} from 'react-redux';
import {fetchBooks, addToCart, removeFromCart, cartModalToggle}  from './actions';

import { 
  Container,
  Header,
  Input,
  Icon,
  Rating,
  Grid,
  Segment,
  Button,
  Label,
  Dropdown,
  Modal,
  Table
} from 'semantic-ui-react'


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      books: [],
      displayedBooks: [],
      keyword: '',
      cart: [],
      loaded: 50,
      filterActive: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.findBooks = this.findBooks.bind(this);
    this.handleCart = this.handleCart.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleModal = this.handleModal.bind(this);
  }

  componentDidMount(){
    const {books, cart} = this.props;
    this.setState({
      books,
      cart,
      displayedBooks: books
    });
    if(this.props.books.length===0) {
      this.props.fetchBooks();
    }
  }

  componentDidUpdate(props, state){
    if(this.props.books !== state.books){
      this.setState({
        books: this.props.books,
        displayedBooks: this.props.books, 
        loaded: Math.min(50, this.props.books.length)
      });
    }
    if(this.props.cart !== state.cart){
      this.setState({cart: this.props.cart});
    }
  }

  handleChange = e => {
    const {loaded} = this.state;
    this.setState({
      [e.target.name]: e.target.value,
      loaded,
    });
    this.findBooks(e.target.value);
  }

  findBooks = (keyword) => {
    if(keyword !== ''){
      const books = this.state.books.filter(b => String(b.title).includes(keyword));
      this.setState({displayedBooks: books});
    }else{
      const {loaded, displayedBooks, filterActive} = this.state;
      if(!filterActive) {
        this.setState({displayedBooks, loaded});
      }
    }
  }

  handleCart = (book) => {
    const {cart} = this.state;
    if(!cart.includes(book)){
      this.props.addToCart(book);
    }else{
      this.props.removeFromCart(book);
    }
  }

  loadBooks = () => {
    const {loaded, books} = this.state;
    this.setState({loaded: Math.min(loaded+50, books.length)});
  }

  handleDropDownChange = (e, {value}) => {
    let {books, displayedBooks, loaded, keyword} = this.state;
    if(keyword === '') displayedBooks = [...books];
    this.setState({filterActive: true});
    if(value == 1){
      displayedBooks.sort(function(a,b){
        if(a.price>b.price) return 1;
        return -1;
      });
      this.setState({displayedBooks, loaded});
    }else if(value == 2){
      displayedBooks.sort(function(a,b){
        if(a.price<b.price) return 1;
        return -1;
      });
      this.setState({displayedBooks, loaded});
    }else if(value == 3){
      displayedBooks.sort(function(a,b){
        if(a.average_rating>b.average_rating) return 1;
        return -1;
      });
      this.setState({displayedBooks, loaded});
    }else if(value == 4){
      displayedBooks.sort(function(a,b){
        if(a.average_rating<b.average_rating) return 1;
        return -1;
      });
      this.setState({displayedBooks, loaded});
    }else{
      if(keyword === '') displayedBooks = [...books];
      this.setState({ displayedBooks, loaded, filterActive: false});
    }
  }

  handleModal = status => {
    this.props.cartModalToggle(status);
  }

  render() {
    const {books, keyword, cart, displayedBooks, loaded} = this.state;
    return (
      <>
        <Modal
          closeIcon
          open={this.props.cartModalOpen}
          onClose={() => this.handleModal(false)}
          onOpen={() => this.handleModal(true)}
        >
          <Header icon='archive' content='Thank you for shopping with us' />
          <Modal.Content>
            <Table celled striped>
              <Table.Header key = 'a'>
                <Table.Row>
                  <Table.HeaderCell colSpan='3'>Your Cart</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {
                cart.map((c,i) => (
                  <Table.Row key = {c.bookID}>
                    <Table.Cell collapsing>{i+1}</Table.Cell>
                    <Table.Cell>{c.title}</Table.Cell>
                    <Table.Cell collapsing>$ {c.price}</Table.Cell>
                  </Table.Row>
                ))
              }
              
            </Table>
            <Header as = 'h4' textAlign = 'right'>
                Total: $ {cart.length>0 && cart.map(item => item.price).reduce((prev, next) => prev + next)}
            </Header>
          </Modal.Content>

          <Modal.Actions>
            <Button color='red' onClick={() => this.handleModal(false)}>
              <Icon name='remove' /> Cancel
            </Button>
            <Button color='green' onClick={() => this.handleModal(false)}>
              <Icon name='checkmark' /> Proceed
            </Button>
          </Modal.Actions>
        </Modal>
        {
          books.length === 0 ? (<div>Loading Books...</div>) : (
          <Container style = {{marginTop: '20px'}}>
          <Header as = 'h1' textAlign = 'center'>BookStore</Header>
          <Input 
            fluid
            size = 'large'
            icon = 'search'
            iconPosition = 'left'
            placeholder = 'Search Book Name...'
            action = 'Search'
            name = 'keyword'
            value = {keyword}
            onChange = {this.handleChange}
          />
          <br />
          <br />
          <Dropdown 
            clearable 
            placeholder = 'Sort By: '
            options={[
              { key: 1, text: 'Price (Low to High)', value: 1 },
              { key: 2, text: 'Price (High to Low)', value: 2 },
              { key: 3, text: 'Rating (Low to High)', value: 3 },
              { key: 4, text: 'Rating (High to Low)', value: 4 },
            ]} 
            selection 
            onChange = {this.handleDropDownChange}
          />
          <Grid centered stackable columns={3}>
            {
              displayedBooks.slice(0,loaded).map((book, i) => (
                <Grid.Column key = {book.bookID}>
                    <Button 
                      circular
                      icon = 'add to cart'
                      color = {this.props.cart.find(x => x.bookID === book.bookID) ? 'red' : 'grey'}
                      style = {{
                        position: 'absolute',
                        top: '12px',
                        right: '-6px',
                        zIndex: '10'
                      }}
                      onClick = {() => this.handleCart(book)}
                    />
                  <Segment raised textAlign = 'center' style = {{height: '300px', overflow: 'hidden', paddingTop: '-50px'}}>
                    <Label color = 'blue' attached = 'top left'>{book.language_code}</Label>
                    <Header icon>
                      <Icon name='book' />
                      {book.title}
                    </Header>
                    <center>
                      <Header as = 'h5'>
                        <b>{book.authors}</b>
                      </Header>
                      <Rating defaultRating = {book.average_rating} maxRating = {5} disabled/>
                      <Segment.Inline>
                        <span style = {{fontSize: '10px'}}>
                          ISBN: {book.isbn}
                        </span>
                        <br />
                        <span style = {{fontSize: '13px', fontWeight: 'bold'}}>
                          Price: ${book.price}
                        </span>
                      </Segment.Inline>
                    </center>
                  </Segment>
                </Grid.Column>
              )
              )
            }
          </Grid>
          <br />
          <center>
            <p href = '#' style = {{cursor: 'pointer', margin: '10px', color: 'blue', textDecoration: 'underline'}} onClick = {this.loadBooks}>
              Load More Books? 
            </p>
          </center>
          <br />
          <Button 
            circular
            size = 'massive'
            color = 'green'
            icon = 'cart'
            style = {{
              position: 'fixed',
              bottom: '10px',
              right: '10px'
            }}
            disabled = {cart.length === 0}
            onClick = {() => this.handleModal(true)}
          />
        </Container>
          )
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  books: state.books,
  cart: state.cart,
  cartModalOpen: state.cartModalOpen
})

export default connect(mapStateToProps, {
  fetchBooks,
  addToCart,
  removeFromCart,
  cartModalToggle
})(App);