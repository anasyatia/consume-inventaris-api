import React from "react";
import Navbar from "./navbar";

export default function Case({ children }) {
    return (
        <div className="bg-gray-100 dark:bg-gray-100 min-h-screen">
        <Navbar />
        <section>{children}</section>
        </div>
    );
}