
import React from 'react'
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { useCallback, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
const Tool_Bar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
]



const TextEditor = () => {

    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id: documentid } = useParams();
    console.log(documentid);

    useEffect(() => {
        console.log(socket,quill);
        if (socket == null || quill == null) return;
        socket.once("load-document", data => {
            console.log(data);
            quill.setContents(data);
            quill.enable();

        })

        socket.emit("getdocument", documentid);

    }, [socket, quill, documentid])

    useEffect(() => {
        if(quill==null ||socket==null)return;
        console.log("i am in save");
        console.log(quill.getContents());
         const interval= setInterval(() => {
              socket.emit("save-changes",quill.getContents());
          }, 2000);

          return ()=>{
              clearInterval(interval);
          }
    }, [socket,quill])

    useEffect(() => {
        if (socket == null || quill == null)
            return;
        const changeHandler = (delta, oldDelta, source) => {
            if (source !== "user")
                return;
            socket.emit("send-changes", delta);
        }

        quill.on("text-change", changeHandler);
        return () => {
            quill.off("text-change", changeHandler);
        }

    }, [socket, quill])


    useEffect(() => {
        if (socket == null || quill == null)
            return;
        const Handler = delta => {
            quill.updateContents(delta);
        }

        socket.on("recieve-changes", Handler);
        return () => {
            socket.off("recieve-changes", Handler);
        }

    }, [socket, quill])

    useEffect(() => {
        const s = io("https://doc-clone.herokuapp.com/");//server side port
        setSocket(s);

        return () => {
            s.disconnect();
        }

    }, [])
    const wrapperRef = useCallback(wrapper => {
        if (wrapper === null) return;
        // console.log(wrapper.innerHtml);
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, { theme: "snow", modules: { toolbar: Tool_Bar } })

        q.disable();
        q.setText("loading");
        setQuill(q);
        //hgjghjhghj
        //vhvhhhjjghjghjg
        //gfdhf
    }, [])
    return (
        <>
            <div className="container" ref={wrapperRef}></div>
        </>
    )
}

export default TextEditor
