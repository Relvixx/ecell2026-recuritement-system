import { RECRUITMENT_LINKS } from '@/config/recruitment';

export const RECRUITMENT_SHARE_FILENAME = 'ecell-met-recruitment-2026.png';
export const RECRUITMENT_SHARE_URL = RECRUITMENT_LINKS.websiteUrl;
export const RECRUITMENT_SHARE_CAPTION = `Just applied to join E-CELL MET\nReady to build, create, connect and execute.\n\nThink you'd fit in too? Apply now.\n\n@ecell.met`;

let cachedCardPromise = null;

function toError(error, fallbackMessage) {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${source}`));
    image.src = source;
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to generate recruitment story image.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

function createShareFile(blob) {
  if (typeof File === 'undefined') return null;

  try {
    return new File([blob], RECRUITMENT_SHARE_FILENAME, { type: 'image/png' });
  } catch (error) {
    console.error('Failed to create a shareable recruitment story file.', toError(error, 'Failed to create a shareable file.'));
    return null;
  }
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = nextLine;
    }
  });

  if (line) context.fillText(line, x, currentY);
  return currentY;
}

function drawLogo(context, image) {
  const maxSize = 146;
  const scale = Math.min(maxSize / image.width, maxSize / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, 108, 115, width, height);
}

export async function generateRecruitmentShareCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Your browser could not create the story card.');

  context.fillStyle = '#121212';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'rgba(255, 250, 242, 0.075)';
  context.lineWidth = 1;
  for (let x = 48; x < canvas.width; x += 72) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 48; y < canvas.height; y += 72) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.strokeStyle = 'rgba(179, 59, 66, 0.34)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(780, 102);
  context.lineTo(954, 102);
  context.lineTo(954, 188);
  context.lineTo(1014, 188);
  context.stroke();
  context.fillStyle = '#b33b42';
  [780, 954, 1014].forEach((x, index) => {
    context.beginPath();
    context.arc(x, index === 0 ? 102 : index === 1 ? 188 : 188, 5, 0, Math.PI * 2);
    context.fill();
  });

  context.fillStyle = '#b33b42';
  context.fillRect(0, 0, 34, canvas.height);
  context.fillRect(810, 0, 270, 26);

  context.save();
  context.fillStyle = '#f9f5ed';
  context.beginPath();
  context.moveTo(82, 290);
  context.lineTo(998, 235);
  context.lineTo(955, 1515);
  context.lineTo(132, 1648);
  context.lineTo(70, 890);
  context.closePath();
  context.fill();
  context.restore();

  context.save();
  context.translate(808, 172);
  context.rotate(-0.1);
  context.fillStyle = 'rgba(220, 199, 149, 0.76)';
  context.fillRect(0, 0, 194, 42);
  context.restore();

  try {
    const logo = await loadImage('/brand/ecell-met-logo.png');
    drawLogo(context, logo);
  } catch (error) {
    console.error('Failed to load the E-CELL logo for the recruitment story card.', toError(error, 'Failed to load the E-CELL logo.'));
    context.fillStyle = '#b33b42';
    context.beginPath();
    context.arc(175, 182, 52, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#f9f5ed';
    context.font = '600 34px Arial, sans-serif';
    context.fillText('E', 164, 194);
  }

  context.fillStyle = '#242120';
  context.font = '500 35px Arial, sans-serif';
  context.fillText('E-CELL MET', 108, 320);
  context.fillStyle = '#7b2d33';
  context.font = '500 26px Arial, sans-serif';
  context.fillText('RECRUITMENT 2026–27', 108, 365);

  context.fillStyle = '#242120';
  context.font = '500 112px Georgia, serif';
  context.fillText('I JUST APPLIED', 108, 650);
  context.fillText('TO BUILD WITH', 108, 790);
  context.fillStyle = '#b33b42';
  context.fillText('E-CELL.', 108, 930);

  context.strokeStyle = '#b33b42';
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(112, 970);
  context.lineTo(510, 946);
  context.stroke();

  context.fillStyle = '#242120';
  context.font = '500 31px Arial, sans-serif';
  context.fillText('BUILD  /  CREATE  /  CONNECT  /  EXECUTE', 108, 1090);

  context.strokeStyle = 'rgba(36, 33, 32, 0.26)';
  context.lineWidth = 2;
  context.setLineDash([10, 14]);
  context.beginPath();
  context.moveTo(108, 1180);
  context.lineTo(885, 1180);
  context.stroke();
  context.setLineDash([]);

  context.fillStyle = '#242120';
  context.font = '500 58px Georgia, serif';
  const lastLineY = drawWrappedText(context, "Think you'd fit in too?", 108, 1325, 670, 74);
  context.fillStyle = '#7b2d33';
  context.font = '500 24px Arial, sans-serif';
  context.fillText('TAG US', 108, lastLineY + 82);
  context.fillStyle = '#242120';
  context.font = '500 36px Arial, sans-serif';
  context.fillText('@ecell.met', 108, lastLineY + 126);
  context.fillStyle = '#6b625d';
  context.font = '400 24px Arial, sans-serif';
  context.fillText('Learn more at', 108, lastLineY + 194);
  context.fillStyle = '#7b2d33';
  context.font = '500 28px Arial, sans-serif';
  context.fillText(RECRUITMENT_SHARE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''), 108, lastLineY + 238);

  context.fillStyle = '#f9f5ed';
  context.font = '400 23px Arial, sans-serif';
  context.fillText('E-CELL MET  •  STUDENT ENTREPRENEURSHIP CELL', 108, 1816);
  context.fillStyle = '#b33b42';
  context.beginPath();
  context.arc(932, 1798, 11, 0, Math.PI * 2);
  context.fill();

  const blob = await canvasToBlob(canvas);
  const file = createShareFile(blob);

  return { blob, file };
}

export function getRecruitmentShareCard() {
  if (!cachedCardPromise) {
    cachedCardPromise = generateRecruitmentShareCard().catch((error) => {
      cachedCardPromise = null;
      throw error;
    });
  }

  return cachedCardPromise;
}
