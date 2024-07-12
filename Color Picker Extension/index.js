let pickedColors = JSON.parse(localStorage.getItem("colors-list")) || [];
let currentPopup = null;

document.querySelector("#export-btn").addEventListener('click', () => {
    const colorText = pickedColors.map(hex => `${hex}-${hexToRgb(hex)}`).join("\n");
    const blob = new Blob([colorText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Colors.txt";
    a.click();
    URL.revokeObjectURL(url);
});

document.querySelector("#clear-btn").addEventListener('click', () => {
    pickedColors = [];
    localStorage.removeItem("colors-list");
    showColors();
});

const copyToClipboard = async (text, element) => {
    try {
        await navigator.clipboard.writeText(text);
        element.innerText = "Copied!";
        setTimeout(() => {
            element.innerText = text;
        }, 1000);
    } catch (error) {
        alert("Failed to copy text!");
    }
};

const hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
};

const createColorPopup = (color) => {
    const popup = document.createElement("div");
    popup.classList.add("color-popup");
    popup.innerHTML = `
        <div class="color-popup-content">
            <span class="close-popup">x</span>
            <div class="color-info">
                <div class="color-preview" style="background: ${color};"></div>
                <div class="color-details">
                    <div class="color-value">
                        <span class="label">Hex:</span>
                        <span class="value hex" data-color="${color}">${color}</span>
                    </div>
                    <div class="color-value">
                        <span class="label">RGB:</span>
                        <span class="value rgb" data-color="${color}">${hexToRgb(color)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    popup.querySelector(".close-popup").addEventListener('click', () => {
        document.body.removeChild(popup);
        currentPopup = null;
    });

    popup.querySelectorAll(".value").forEach((value) => {
        value.addEventListener('click', (e) => {
            copyToClipboard(e.currentTarget.innerText, e.currentTarget);
        });
    });

    return popup;
};

const showColors = () => {
    document.querySelector(".all-colors").innerHTML = pickedColors.map((color) =>
        `
            <li class="color">
                <span class="rect" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#ccc" : color}"></span>
                <span class="value hex" data-color="${color}">${color}</span>
            </li>
        `
    ).join("");

    document.querySelectorAll(".color").forEach(li => {
        li.querySelector(".value.hex").addEventListener('click', e => {
            const color = e.currentTarget.dataset.color;
            if (currentPopup) {
                document.body.removeChild(currentPopup);
            }
            const popup = createColorPopup(color);
            document.body.appendChild(popup);
            currentPopup = popup;
        });
    });

    document.querySelector(".colors-list").classList.toggle("hide", pickedColors.length === 0);
};

showColors();

const imageLoader = document.getElementById('imageLoader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

document.querySelector("#picker-btn").addEventListener('click', () => {
    imageLoader.click();
});

canvas.addEventListener('click', event => {
    const rgbToHex = (r, g, b) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    const x = event.offsetX;
    const y = event.offsetY;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
    if (!pickedColors.includes(hexColor)) {
        pickedColors.push(hexColor);
        localStorage.setItem("colors-list", JSON.stringify(pickedColors));
    }
    showColors();
});

imageLoader.addEventListener('change', event => {
    const reader = new FileReader();
    reader.onload = event => {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.style.display = "block";
            document.body.style.display = "block";
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});