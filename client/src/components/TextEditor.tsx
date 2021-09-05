import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import "quill/dist/quill.snow.css"
import Quill, { Sources } from "quill";
import { io, Socket } from 'socket.io-client';
import Delta from 'quill-delta';
import { useParams } from 'react-router';

interface Params {
    id: string;
}

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false]}],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" ,}],
    ["bold", "italic", "underline"],
    [{ color: [] }, {background: [] }],
    [{ script: "sub" }, {script: "super"}],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

const SAVE_INTERVAL_MS = 2000;

export default function TextEditor(): ReactElement {
    const [socket, setSocket] = useState<Socket>();
    const [quill, setQuill] = useState<Quill>();
    const { id: documentId } = useParams<Params>();

    // Connect socket.io
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        return () => {
            s.disconnect();
        }
    }, [])

    // Load document
    useEffect(() => {

        socket?.on('load-document', document => {
            quill?.setContents(document);
            quill?.enable();
        })

        socket?.emit('get-document', documentId)
    }, [socket, quill, documentId])

    // Save document
    useEffect(() => {
        const interval = setInterval(() => {
            socket?.emit('save-document', quill?.getContents())
        }, SAVE_INTERVAL_MS);

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill])

    // Send changes
    useEffect(() => {
        const makeChangeHandler = (delta: Delta, oldDelta: Delta, source: Sources) => {
            if (source !== "user") return;
            socket?.emit('send-changes', delta);
        }
        quill?.on("text-change", makeChangeHandler);

        return () => {
            quill?.off("text-change", makeChangeHandler)
        }
    }, [socket, quill])

    // Receive changes
    useEffect(() => {
        const onChangeHandler = (delta: Delta) => {
            quill?.updateContents(delta);
        }

        socket?.on('receive-changes', onChangeHandler)
        return () => {
            socket?.off('receive-changes', onChangeHandler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback(
        (wrapper: HTMLElement | null) => {
            if (wrapper == null) return;
            
            wrapper.innerHTML = "";
            const textEditor = document.createElement("div");
            wrapper.append(textEditor);
            const q = new Quill(textEditor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS}});
            q.disable();
            q.setText("Loading...");
            setQuill(q);
        },
        [],
    )

    return (
        <div className="container" ref={wrapperRef}>
        </div>
    )
}
