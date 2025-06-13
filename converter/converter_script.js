document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusText = document.getElementById('statusText');
    const progressBar = document.getElementById('progressBar');

    let fileContent = null;
    let generatedYaml = null;

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    const handleFile = (file) => {
        resetState();
        if (file) {
            uploadText.textContent = file.name;
            statusText.textContent = '文件已就绪';
            progressBar.classList.add('visible');
            const reader = new FileReader();
            reader.onload = (e) => {
                fileContent = e.target.result;
                generateBtn.disabled = false;
                statusText.textContent = '准备就绪，可以生成';
            };
            reader.onerror = () => {
                statusText.textContent = '文件读取失败';
                statusText.className = 'status-text error';
            };
            reader.readAsText(file);
        }
    };

    const processFileContent = (content) => {
        const lines = content.split('\n');
        const numberPairs = [];
        const numberRegex = /\d+/g;

        for (const line of lines) {
            const numbers = line.match(numberRegex);
            if (numbers && numbers.length >= 2) {
                numberPairs.push([numbers[0], numbers[1]]);
            }
        }

        if (numberPairs.length === 0) {
            return null;
        }

        let yamlOutput = 'search_targets:\n';
        for (const pair of numberPairs) {
            yamlOutput += `   - [${pair[0]}, ${pair[1]}]\n`;
        }
        return yamlOutput;
    };
    
    generateBtn.addEventListener('click', () => {
        if (!fileContent) return;
        
        statusText.textContent = '正在处理...';
        generatedYaml = processFileContent(fileContent);

        setTimeout(() => {
            if (generatedYaml) {
                statusText.textContent = 'YAML文件生成成功!';
                statusText.className = 'status-text success';
                downloadBtn.classList.remove('hidden');
                generateBtn.classList.add('hidden');
            } else {
                statusText.textContent = '未在文件中找到有效数据对';
                statusText.className = 'status-text error';
            }
        }, 500);
    });

    downloadBtn.addEventListener('click', () => {
        if (!generatedYaml) return;
        
        const blob = new Blob([generatedYaml], { type: 'text/yaml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    const resetState = () => {
        fileContent = null;
        generatedYaml = null;
        generateBtn.disabled = true;
        generateBtn.classList.remove('hidden');
        downloadBtn.classList.add('hidden');
        uploadText.innerHTML = '拖拽文件到此处，或 <span>点击选择</span>';
        statusText.textContent = '请上传文件';
        statusText.className = 'status-text';
        progressBar.classList.remove('visible');
    };

    document.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
});