import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
// import '@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap")';
export default function Footer() {
  return (
    <Container>
    <Row className='border-top border-2 border-dark'>
        <Col>
        <div className=''>
        <p className='p-0 mx-0' style={{ fontWeight: '700', fontSize: '19px', letterSpacing: '1.4px'}}>HeHeSNEAKER.COM</p>
          <p className='p-0 m-0'>Address: FPT University</p>
          <p className='p-0 m-0'>Phone:<bold>1</bold></p>
          <p className='p-0 m-0'>Email: hehehe@gmail.com</p>
        </div>
          </Col>
          <Col>
        <div className=''>
        <p className='p-0 mx-0' style={{ fontWeight: '700', fontSize: '19px', letterSpacing: '1.4px'}}>CHĂM SÓC KHÁCH HÀNG</p>
          <p className='p-0 m-0'>Hướng dẫn mua hàng</p>
          <p className='p-0 m-0'>Chính sách bảo mật</p>
          <p className='p-0 m-0'>Hình thức thanh toán</p>
          <p className='p-0 m-0'>Vận chuyển và giao hàng</p>
        </div>
          </Col>
          <Col>
        <div className=''>
          <p className='p-0 mx-0' style={{ fontWeight: '700', fontSize: '19px', letterSpacing: '1.4px'}}>THÔNG TIN</p>
          <p className='p-0 m-0'>Tài khoản</p>
          <p className='p-0 m-0'>Kiểm tra đơn hàng</p>
        </div>
          </Col>
          <Col>
        <div className=''>
        <p className='p-0 mx-0' style={{ fontWeight: '700', fontSize: '19px', letterSpacing: '1.4px'}}>SHOPP</p>
          <p className='p-0 m-0'>Abibas</p>
          <p className='p-0 m-0'>Niek</p>
          <p className='p-0 m-0'>Luisvuituoi</p>
        </div>
          </Col>
    </Row>
    <Row className='d-flex justify-content-center'>
      <div className='text-center mt-5 w-50'>
        <p className='h4'>HeHeSneaker store in City</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>
    </Row>
    <Row className='bg-light border-top border-1 border-dark text-center' style={{height: '80px'}}>
    <p className='my-auto'>HeheSneaker.com</p>
    </Row> 
    </Container>
  )
}
