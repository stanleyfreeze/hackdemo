//@ts-nocheck
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// 创建并设置侧边栏
chrome.devtools.panels.elements.createSidebarPane("My Sidebar", (sidebar) => {
  sidebar.setPage();
});

const Panel = () => {
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    // 调用chrome.devtools.inspectedWindow.eval，开始记录
    chrome.devtools.inspectedWindow.eval(`
    (async () => {
      debugger;
      const id = await window.record.record();
      console.log(id);
      window.recordplayer = {id:id};
    })()`,(result,error) => {
      console.log(result);
    });
    setRecording(true);
  };

  const stopRecording = () => {
    // 调用chrome.devtools.inspectedWindow.eval，停止记录
    chrome.devtools.inspectedWindow.eval(`
    (async () => {
      debugger;
      console.log(window.recordplayer.id);
      await window.record.stop(window.recordplayer.id);
    })()`,(result,error) => {
      console.log(result);
    });
    setRecording(false);
  };

  const downloadActions = () => {
    // 调用chrome.devtools.inspectedWindow.eval，获取actions
    chrome.devtools.inspectedWindow.eval(`
    (async () => {
      debugger;
      const aa = await window.record.getActions()
    })()`
      ,
      (result,error) => {
        console.log(result);
      }
    );
  };

  const getActions = (actions) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(actions));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "actions.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={downloadActions}>Download Actions</button>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Panel />
  </React.StrictMode>
);