import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import tacoLogo from './assets/taco_logo.png';
import "./css/Nav.css"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Input, 
  InputGroup,
  Row,
  Col } from 'reactstrap';


export default class NavigationBar extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(props) { 
    return (
      <div>
        <Navbar className="nav to-the-top" light expand="md">
          <NavbarBrand href="/"><div><img src={tacoLogo} height="90em" width="130em" /></div></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          <Container>
            <Nav className="navbar text-white nav-items" navbar>
                 <NavItem>
                   <NavLink href="/restaurants"><h3 className="text-white">Restaurants</h3></NavLink>
                 </NavItem>
                 <NavItem>
                   <NavLink href="/attractions"><h3 className="text-white">Attractions</h3></NavLink>
                 </NavItem>
                 <NavItem>
                   <NavLink href="/hotels"><h3 className="text-white">Hotels</h3></NavLink>
                 </NavItem>
                 <NavItem>
                   <NavLink href="/about"><h3 className="text-white">About</h3></NavLink>
                 </NavItem>
                 <NavItem>
                    {/*<InputGroup className="nav-search"> 
                      <Input placeholder="Search something"/>
                    </InputGroup>*/}
                   <NavLink href="/search"><h3 className="text-white">Search</h3></NavLink>
                 </NavItem>

            </Nav>
            </Container>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}



