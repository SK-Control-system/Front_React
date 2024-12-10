import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Subscription.css';

function Subscription({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>구독 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="subscriptionInput">
            <Form.Control type="text" placeholder="구독할 유튜브 채널ID를 입력하세요" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          닫기
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            alert('구독이 추가되었습니다!');
            onHide();
          }}
        >
          추가
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Subscription;
