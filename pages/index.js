import { useState, useRef } from "react";
import { Button, Group, Container, Card, Divider, Title } from "@mantine/core";

const colorHexArray = [
  "#808080", "#ff0000", "#008000", "#ffff00",
  "#0000ff", "#ff00ff", "#00ffff", "#ffffff",
];

const bgColorArray = [
  "#0b3d91", "#ff4500", "#1e90ff", "#afeeee",
  "#808080", "#4b0082", "#d3d3d3", "#ffffff",
];

const discordColorMap = {
  "#808080": "[2;30m", "#ff0000": "[2;31m", "#008000": "[2;32m",
  "#ffff00": "[2;33m", "#0000ff": "[2;34m", "#ff00ff": "[2;35m",
  "#00ffff": "[2;36m", "#ffffff": "[2;37m",
};

const discordBgColorMap = {
  "#0b3d91": "[2;40m", "#ff4500": "[2;41m", "#1e90ff": "[2;42m",
  "#afeeee": "[2;43m", "#808080": "[2;44m", "#4b0082": "[2;45m",
  "#d3d3d3": "[2;46m", "#ffffff": "[2;47m",
};

export default function Home() {
  const [selectedTextColor, setSelectedTextColor] = useState(colorHexArray[0]);
  const [selectedBgColor, setSelectedBgColor] = useState(bgColorArray[0]);
  const editableRef = useRef(null);

  const applyTextColor = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // Avoid empty spans

    const span = document.createElement("span");
    span.dataset.ansiColor = selectedTextColor;
    span.style.color = selectedTextColor;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
  };

  const applyBgColor = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // Avoid empty spans

    const span = document.createElement("span");
    span.dataset.ansiBgColor = selectedBgColor;
    span.style.backgroundColor = selectedBgColor;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
  };

  const applyBold = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const strong = document.createElement("strong");
    strong.appendChild(range.extractContents());
    range.insertNode(strong);
    selection.removeAllRanges();
  };

  const applyUnderline = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const u = document.createElement("u");
    u.appendChild(range.extractContents());
    range.insertNode(u);
    selection.removeAllRanges();
  };

  const resetText = () => {
    if (editableRef.current) {
      editableRef.current.innerHTML = "Welcome to Discord Colored Text Generator!";
    }
  };

  const copyText = () => {
    if (!editableRef.current) return;

    let discordFormatted = "```ansi\n";

    editableRef.current.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        discordFormatted += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        let textContent = node.textContent;
        let textCode = "[2;37m";
        let bgCode = "";

        if (node.dataset.ansiColor) {
          textCode = discordColorMap[node.dataset.ansiColor] || "[2;37m";
        }
        if (node.dataset.ansiBgColor) {
          bgCode = discordBgColorMap[node.dataset.ansiBgColor] || "";
        }
        if (node.tagName === "STRONG") {
          textContent = `\u001b[1m${textContent}\u001b[22m`;
        }
        if (node.tagName === "U") {
          textContent = `\u001b[4m${textContent}\u001b[24m`;
        }
        discordFormatted += `\u001b${textCode}${bgCode ? `\u001b${bgCode}` : ""}${textContent}\u001b[0m`;
      }
    });

    resetText();

    discordFormatted += "\n```";

    navigator.clipboard.writeText(discordFormatted).then(() => {
      alert("Copied with latest applied colors!");
    });
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Title order={2} style={{ color: "#fff", fontFamily: "monospace", marginBottom: "20px" }}>
        Discord Colored Text Generator
      </Title>

      <Card
        ref={editableRef}
        shadow="lg"
        padding="lg"
        style={{
          minHeight: "100px",
          backgroundColor: "#1e1e1e",
          borderRadius: "10px",
          fontFamily: "monospace",
          fontSize: "18px",
          color: "#ffffff",
          whiteSpace: "pre-wrap",
          cursor: "text",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
        }}
        contentEditable
        suppressContentEditableWarning
      >
        Welcome to Discord Colored Text Generator!
      </Card>

      <Divider my="lg" />

      <Title order={4} style={{ color: "b", marginBottom: "10px" }}>Choose Text Color:</Title>
      <Group position="center" spacing="xs">
        {colorHexArray.map((color) => (
          <Button
            key={color}
            style={{
              backgroundColor: color,
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: selectedTextColor === color ? "3px solid white" : "2px solid rgba(255,255,255,0.5)",
              transition: "0.3s",
            }}
            onClick={() => setSelectedTextColor(color)}
          />
        ))}
      </Group>

      <Group position="center" mt="md">
        <Button onClick={applyTextColor} color="blue">🎨 Apply Text Color</Button>
      </Group>

      <Divider my="lg" />

      <Title order={4} style={{ color: "black", marginBottom: "10px" }}>Choose Background Color:</Title>
      <Group position="center" spacing="xs">
        {bgColorArray.map((color) => (
          <Button
            key={color}
            style={{
              backgroundColor: color,
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: selectedBgColor === color ? "3px solid white" : "2px solid rgba(255,255,255,0.5)",
              transition: "0.3s",
            }}
            onClick={() => setSelectedBgColor(color)}
          />
        ))}
      </Group>

      <Group position="center" mt="md">
        <Button onClick={applyBgColor} color="blue">🎨 Apply Background Color</Button>
      </Group>

      <Divider my="lg" />

      <Group position="center" spacing="md">
        <Button onClick={applyBold}><b>B</b></Button>
        <Button onClick={applyUnderline}><u>U</u></Button>
        <Button onClick={resetText}>🔄 Reset Text</Button>
        <Button onClick={copyText}>📋 Copy Text</Button>
      </Group>
      </Container>
  )
}