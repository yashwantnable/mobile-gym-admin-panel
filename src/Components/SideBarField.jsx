import React from "react";
import { IoClose } from "react-icons/io5";

const SidebarField = ({
    children,
    button0,
    button1,
    button2,
    title,
    title_style,
    handleClose,
    left,
    footer = true,
    close = true,
    padding
}) => {

    return (
        <div className={` ${close ? "side-modal" : ""}`}>
            <div
                style={left ? { left: "0" } : { right: "0" }}
                className="modal-container z-10 border shadow"
            >
                <header
                    className={`border-b p-5 flex justify-between items-center ${title_style ? title_style : "text-lg"}`}
                >
                    <div>{title}</div>
                    {close ? (
                        <div className="cursor-pointer text-black" onClick={handleClose}>
                            <IoClose />
                        </div>
                    ) : (
                        ""
                    )}
                </header>
                <main
                    className={`overflow-y-auto  ${padding ? padding : 'p-3 '} w-full ${footer ? "h-[84vh]" : "h-[92vh]"}`}
                    style={{ height: footer ? "calc(100vh - 150px)" : "92vh" }}
                >
                    {children}
                </main>
                {footer ? (
                    <footer className="border-t p-5 flex justify-center items-center gap-1">
                        {button1}
                        {button0 ? button0 : ""}
                        {button2}
                    </footer>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default SidebarField;
