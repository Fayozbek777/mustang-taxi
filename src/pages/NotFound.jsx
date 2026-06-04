import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "./UI/NotFound.css";

// Регистрируем плагин для траекторий шариков
gsap.registerPlugin(MotionPathPlugin);

export default function NotFound() {
  const svgRef = useRef(null);
  const behindSvgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const behind_svg = behindSvgRef.current;
    if (!svg || !behind_svg) return;

    let size = { width: window.innerWidth, height: window.innerHeight };

    const onResize = () => {
      size.width = window.innerWidth;
      size.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const getColor = () => {
      const isGold = Math.random() > 0.3;
      if (isGold) {
        return `hsl(${45 + Math.random() * 10}, 100%, ${45 + Math.random() * 20}%)`;
      } else {
        return `hsl(240, 10%, ${20 + Math.random() * 15}%)`;
      }
    };

    const createBalloon = () => {
      const useEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use",
      );
      useEl.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "#balloon",
      );
      useEl.setAttribute("style", `--color:${getColor()}`);
      useEl.setAttribute("class", "balloon");
      return useEl;
    };

    const popBalloon = (colorSettings, x, y, isBehind) => {
      const pop = document.createElementNS("http://www.w3.org/2000/svg", "use");
      pop.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#pop");
      pop.setAttribute("style", colorSettings);
      pop.setAttribute("class", "pop");

      if (isBehind) behind_svg.appendChild(pop);
      else svg.appendChild(pop);

      gsap.set(pop, {
        scale: 0.5,
        x: x,
        y: y,
        rotation: Math.random() * 360,
        transformOrigin: "center",
      });
      gsap.to(pop, {
        duration: 0.2,
        scale: 3,
        opacity: 0,
        ease: "power3.out",
        onComplete: () =>
          isBehind ? behind_svg.removeChild(pop) : svg.removeChild(pop),
      });

      for (let i = 0; i <= 10; i++) {
        const confetti = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "use",
        );
        confetti.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          `#confetti_${Math.ceil(Math.random() * 2)}`,
        );
        confetti.setAttribute("style", `--color: ${getColor()}`);
        confetti.setAttribute("class", "confetti");

        if (isBehind) behind_svg.appendChild(confetti);
        else svg.appendChild(confetti);

        const randomPos = {
          x: Math.random() * 500 - 250,
          y: Math.random() * 500 - 250,
        };
        gsap.set(confetti, {
          x: x,
          y: y,
          rotation: Math.random() * 360,
          transformOrigin: "center",
        });
        gsap.to(confetti, {
          duration: 3,
          scale: Math.random(),
          motionPath: {
            curviness: 2,
            path: [
              { x: x + randomPos.x, y: y + randomPos.y },
              {
                x: x + randomPos.x + (Math.random() * 20 - 10),
                y: y + randomPos.y + Math.random() * 200,
              },
            ],
          },
          opacity: 0,
          rotation: Math.random() * 360 - 180,
          ease: "power4.out",
          onComplete: () =>
            isBehind
              ? behind_svg.removeChild(confetti)
              : svg.removeChild(confetti),
        });
      }
    };

    const onClick = (x, y, balloon, isBehind) => {
      gsap.killTweensOf(balloon);
      const colorSettings = balloon.getAttribute("style");
      try {
        if (isBehind) behind_svg.removeChild(balloon);
        else svg.removeChild(balloon);
      } catch (e) {
        // Защита на случай, если узел уже удален
        return;
      }
      popBalloon(colorSettings, x, y, isBehind);
    };

    const animateBalloon = (balloon, isBehind = false) => {
      gsap.set(balloon, {
        x: size.width / 2,
        y: size.height + 60,
        transformOrigin: "center",
        scale: isBehind ? 1 : 1.5,
        alpha: 0.95,
        rotation: Math.random() * 180 - 90,
      });

      let centerPos = {
        x: size.width / 4 + Math.random() * (size.width / 2),
        y: size.height / 2,
      };

      let endPos = {
        x: centerPos.x + (Math.random() * 200 - 100),
        y: -100, // Улетают полностью за экран вверх
      };

      gsap.to(balloon, {
        duration: 5 + Math.random() * 3,
        motionPath: {
          curviness: 1.5,
          path: [
            { x: centerPos.x, y: centerPos.y },
            { x: endPos.x, y: endPos.y },
          ],
        },
        scale: isBehind ? 0.5 : 1,
        rotation: 0,
        ease: "power1.in",
        onComplete: () => {
          onClick(endPos.x, endPos.y, balloon, isBehind);
        },
      });

      balloon.addEventListener("click", (e) => {
        onClick(e.clientX, e.clientY, balloon, isBehind);
      });
    };

    const balloonGenerator = setInterval(() => {
      if (!document.hidden) {
        const newBalloon = createBalloon();
        const isBehind = Math.random() > 0.5;
        if (isBehind) behind_svg.appendChild(newBalloon);
        else svg.appendChild(newBalloon);
        animateBalloon(newBalloon, isBehind);
      }
    }, 450);

    // Красивое появление текста при входе на страницу
    gsap.fromTo(
      ".error-content h1",
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" },
    );
    gsap.fromTo(
      ".error-content p, .btn-home",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, stale: true },
    );

    return () => {
      window.removeEventListener("resize", onResize);
      clearInterval(balloonGenerator);
    };
  }, []);

  return (
    <div className="not-found-container" ref={containerRef}>
      {/* Задний слой шаров */}
      <svg id="behind" ref={behindSvgRef} className="stage-svg"></svg>

      {/* Контент по центру */}
      <div className="error-content">
        <h1>404</h1>
        <p>Упс... Кажется, этот маршрут не ведет к цели.</p>
        <span>Попробуй поймать или лопнуть улетающие шарики!</span>
        <Link to="/" className="btn-home">
          Вернуться на главную
        </Link>
      </div>

      {/* Передний слой шаров */}
      <svg id="svg" ref={svgRef} className="stage-svg"></svg>

      {/* SVG Спрайты/Шаблоны для повторного использования */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          {/* Шаблон Шарика */}
          <g id="balloon">
            <path
              d="M6,19.33c-3.67,0-7.33-.67-10.33-2-2.33-1-4-2.67-5-4.67a11.53,11.53,0,0,1-1-4.66,28.24,28.24,0,0,1,1-7.33A24.81,24.81,0,0,1-6.67-5.67,18.84,18.84,0,0,1-2-9.33a20.57,20.57,0,0,1,5.33-2A22.9,22.9,0,0,1,9-11.67a21,21,0,0,1,5.33.67A18,18,0,0,1,19-9c1.44,1.11,2.67,2.44,3.67,4a26.85,26.85,0,0,1,2.33,5.67,31,31,0,0,1,1,7.33,12,12,0,0,1-1,4.66c-1,2-2.67,3.67-5,4.67C13.33,18.66,9.67,19.33,6,19.33Z"
              fill="url(#balloonGrad)"
            />
            <path
              d="M-1-12c3,0,6,.33,8.67,1S13-9.33,14-8a10.6,10.6,0,0,1,2,3.33A19.89,19.89,0,0,1,16.67.67a14.73,14.73,0,0,1-.67,3.66c-.33,1-1,1.67-2,2.34S11.67,7.66,9.33,8,4.67,8.33,1,8.33s-7.33-.33-10-1S-13.67,6-.33,4.67a11.12,11.12,0,0,1-2-3.34A19.32,19.32,0,0,1-13-4a15,15,0,0,1,.67-3.67c.33-1,1-1.66,2-2.33S-6.67-11.33-4.33-11.67-1-12-1-12Z"
              fill="var(--color)"
              opacity="0.75"
            />
            <path d="M.5,18.5l-2,4h3Zm-1,4h2v2h-2Z" fill="#fff" opacity="0.4" />
          </g>
          {/* Шаблон Взрыва */}
          <g id="pop">
            <circle
              cx="0"
              cy="0"
              r="10"
              fill="none"
              stroke="var(--color)"
              strokeWidth="2"
            />
            <line
              x1="-15"
              y1="0"
              x2="-25"
              y2="0"
              stroke="var(--color)"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="0"
              x2="25"
              y2="0"
              stroke="var(--color)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="-15"
              x2="0"
              y2="-25"
              stroke="var(--color)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="15"
              x2="0"
              y2="25"
              stroke="var(--color)"
              strokeWidth="2"
            />
          </g>
          {/* Конфетти 1 (Прямоугольник) */}
          <g id="confetti_1">
            <rect x="-6" y="-3" width="12" height="6" fill="var(--color)" />
          </g>
          {/* Конфетти 2 (Круг) */}
          <g id="confetti_2">
            <circle cx="0" cy="0" r="4" fill="var(--color)" />
          </g>
          {/* Градиент объема для шаров */}
          <radialGradient id="balloonGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
