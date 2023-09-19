import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import "./style.css";
import ReactToPrint from "react-to-print";
import FinancialSheetCustomer from "../Shop/FinancialSheetCustomer";

const FinancialCustomer = ({ children, good }) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleShow = () => setShowModal(true);

  const componentRef = useRef();

  const pageStyle = `
   @media print {
      @page {
         size: a5 portrait;
      }
   
      .voucher {
         padding: 1rem 0.5rem;
      }
   }
   `;

  return (
    <>
      <div
        onClick={handleShow}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
      >
        {children}
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                {/* <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Modal Title</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div> */}
                {/*body*/}
                <FinancialSheetCustomer good={good} ref={componentRef} />
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>

                  <ReactToPrint
                    trigger={() => (
                      <Button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                        PRINT
                      </Button>
                    )}
                    content={() => componentRef.current}
                    documentTitle={`BSHOP - INVOICE`}
                    pageStyle={pageStyle}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default FinancialCustomer;
