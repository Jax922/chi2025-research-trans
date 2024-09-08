"use client";

import Image from "next/image";
import { useState, useRef } from 'react';
import { FileUpload} from "@/comp/icon";
import Textarea from 'react-textarea-autosize';
import { fetchQueryAnalysis, fetchComplete } from "@/lib/actions";
import {QAItem} from "@/comp/QAItem";
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import { SolutionCard } from "@/comp/SolutionCard";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import * as React from 'react';



function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}


export default function Home() {
  const [designDoc, setDesignDoc] = useState(''); // 设计文档
  const [query, setQuery] = useState(''); // 用户问题
  const [qa, setQA] = useState({}); // QA 对象
  const [solutions, setSolutions] = useState([]); // 解决方案
  const [title, setTitle] = useState(''); // 标题
  const [desc, setDesc] = useState(''); // 描述
  const [loading, setLoading] = useState(false); // 加载状态
  const [messages, setMessages] = useState([
    // { type: 'user', content: 'This is a user message.This is a user messageThis is a user messageThis is a user messageThis is a user message' },
    // { type: 'file', content: 'uploaded-file.pdf' },
    // { type: 'llm', content: '{}' },
    // { type: 'user', content: 'This is a user message.This is a user messageThis is a user messageThis is a user messageThis is a user message' },
    // { type: 'file', content: 'uploaded-file.pdf' },
    // { type: 'llm', content: '{}' },
  ]);


  const fileInputRef = useRef(null);
  const queryInputRef = useRef(null);

  const handleIconClick = () => {
    // 触发隐藏的 input 点击事件
    fileInputRef.current.click();
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result as string; // 获取文本内容
        console.log(text); // 在控制台输出文件内容
        setDesignDoc(text); // 设置设计文档
      };
  
      reader.readAsText(file); // 读取文本文件内容
    }
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!query) {
      alert('Please type your question first!');
    } else {
      setMessages([
        ...messages,
        { type: 'user', content: query }
      ]);
      const query_copy = query;
      setQuery('');
      // queryInputRef.current.clear();
      const result = await fetchQueryAnalysis(query_copy, designDoc);
      console.log(result);
      setQA(result);
      setMessages([
        ...messages,
        { type: 'user', content: query_copy },
        { type: 'llm', content: result }
      ]); 
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  }

  const handleGenSolution = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const result = await fetchComplete(qa);
    console.log("=====》", result);
    setSolutions(result.solutions);
    setTitle(result.title);
    setDesc(result.desc);
    setLoading(false);
  }

  return (
    <div className="flex w-screen h-screen">
  {/* Left side */}
  <div className="w-3/10 min-w-[500px] bg-[#5E5E5E] text-white flex flex-col max-w-[30%]">
    {/* Fixed title */}
    <div className="p-4 bg-gray-700 font-bold text-3xl sticky top-0">
      Designer's Input
    </div>
    {/* Message area */}
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 p-4 text-xl w-fit rounded-lg  ${
            message.type === 'llm' ? 'bg-white text-black' : 'bg-[#B2B2B2] text-black'
          }`}
          style={{
            maxWidth: message.type === 'file' ? 'none' : '95%',
            marginLeft: message.type === 'user' || message.type === 'file' ? 'auto' : '0',
            marginRight: message.type === 'user' || message.type === 'file' ? '0' : 'auto',
            textAlign: message.type === 'file' ? 'left' : 'inherit'
          }}
        >
          {message.type === 'file' && (
            <div className="flex items-center">
              <span className="material-icons mr-2">
                <i className="fa-regular fa-file-pdf"></i>
              </span>
              <span className="truncate max-w-full">{message.content}</span>
            </div>
          )}
          {message.type === 'user' && <span>{message.content}</span>}
          {message.type === 'llm' && (
            <div>
              <QAItem content={message.content} />  
              <div className="mt-2 space-x-2">
                {/* <button className="bg-gray-300 px-2 py-1 rounded hover:bg-blue-300">
                  Generate Again
                </button>
                <button className="bg-gray-300 px-2 py-1 rounded hover:bg-blue-300" onClick={handleGenSolution}>
                  Explore Solutions!
                </button> */}
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" color="primary" onClick={handleGenSolution}>Generate Again</Button>
                  <Button variant="outlined" color="primary" onClick={handleGenSolution}>Explore Solutions!</Button>
                </Stack>
              </div>
            </div>
            
          )}
        </div>
      ))}
    </div>
    {/* Input area */}
    <div className="p-4 bg-gray-800 sticky bottom-0 flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="text/plain"
        onChange={handleFileChange}
      />
      <span style={{
        display: 'inline-block',
      }} onClick={handleIconClick}
        className="mt-6"
      >
        <FileUpload />
      </span>
      
      {/* <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 bg-gray-600 rounded-lg mr-2"
      /> */}
      <Textarea
                style={{
                }}
                className="text-xl min-h-[40px] w-full resize-none bg-transparent px-2 py-3 focus-within:outline-none sm:text-sm border border-gray-300 rounded-lg px-right-12 pr-[1rem] !leading-tight"
                placeholder="Please type your question here..."  
                minRows={1}
                maxRows={3}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                onChange={handleInputChange}
                value={query}
                ref={queryInputRef}
            />
      <button onClick={handleSend} className="bg-blue-500 p-2 rounded-lg ml-2 text-xl">Send</button>
    </div>
  </div>

  {/* Right side */}
  <div className="w-7/10 bg-white flex flex-col min-w-[70%]">
    {/* Fixed title */}
    <div className="p-4 bg-gray-200 font-bold text-3xl sticky top-0">
      { /* Dynamic title, change as needed */ }
      {title}
    </div>
    <div className="p-4 bg-gray-100 sticky top-0 text-lg">
      {/* Dynamic description, change as needed */}
      {desc}
    </div>
    {/* Content area */}
    <div className="flex-1 overflow-y-auto p-4">
      {/* Default content before solutions are explored */}
      <div className="text-gray-600">
        {/* No solutions explored yet. Click on "Explore Solutions!" to see */}
        {/* generated content. */}
        {
          solutions.length === 0 && !loading && (
            <div className="text-center text-2xl mt-10">
              No solutions explored yet. Click on "Explore Solutions!" to see
              generated content.
            </div>
            
          )
        }
        {
            // loading
            loading && (<div className="flex justify-center items-center">
              <h4 className="text-2xl">Generating solutions..., Please wait a moment.</h4>
              <GradientCircularProgress />
            </div>)

        }
        {/* Solutions content */}
        {
          solutions.map((solution, index) => (
            <SolutionCard key={index} content={solution} />
          ))
        }
      </div>
    </div>
  </div>
</div>

  );
}
