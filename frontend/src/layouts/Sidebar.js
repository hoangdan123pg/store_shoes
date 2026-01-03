import React, { useContext, useState } from 'react'
import { ListGroup } from 'react-bootstrap';
import { Context } from '../context/Context';
export default function Sidebar() {
    const {collection, brand, listFilter, handleClickFilter, handleRemoveFilter } = useContext(Context);
    const [listSize, setListSize] = useState([36, 37, 38, 39, 40, 41, 42, 43, 44, 45]);
    return (
        <>
            <div className="collection border-0 border-bottom border-gray mb-2 me-3" style={{ height: '300px' }}>
                <p className="py-2 my-0 fw-bold"> Brand</p>
                {/* <ListGroup className='border-0'>
                    {collection && collection.map((item, index) => (
                        <ListGroup.Item className="border-0">Cras justo odio</ListGroup.Item>
                    ))}
                </ListGroup> */}
                <ListGroup className='border-0'>
                    {brand.length > 0 && brand.map((item, index) => (
                        <div 
                        className="border-1 border-dark rounded-circle" 
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => handleClickFilter("brand", item.brand)}
                        >
                            <p>{item.brand}</p>
                        </div>
                    ))}
                </ListGroup>
            </div>
            {/* List size */}
            <div className="size border-0 border-bottom border-gray mb-2" style={{ height: '300px' }}>
                <p className="py-2 fw-bold"> SIZE</p>
                <div className="row row-cols-3 w-50" >
                    {listSize && listSize.map((item, index) => (
                        <div key={index} className="col mb-2">
                            <div 
                                className="border border-1 border-gray d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}
                                onClick={() => handleClickFilter("size", item)}
                                >
                                <p className="m-0 fw-bold">{item}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Thương Hiệu */}
            <div className="color border-0 border-bottom border-gray mb-2 me-3" style={{ height: '300px' }}>
                {/* <p className="py-2 my-0 fw-bold"> BRAND</p> */}
                {/* <ListGroup className='border-0'>
                    {brand.length > 0 && brand.map((item, index) => (
                        <div className="border-1 border-dark rounded-circle" style={{ width: '30px', height: '30px' }}>
                            <p>{item.brand}</p>
                        </div>
                    ))}
                </ListGroup> */}
            </div>

        </>
    )
}
