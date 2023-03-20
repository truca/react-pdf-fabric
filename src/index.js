import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

import "./styles.css";
import PageCanvas from "./components/PageCanvas";

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <Container>
        <Row>
          <Col>
            <PageCanvas url="https://uploads.codesandbox.io/uploads/user/de43cd8a-02d5-47fa-8594-378ee2cf3b44/67Ax-sample.pdf" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
