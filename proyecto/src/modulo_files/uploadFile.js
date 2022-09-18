class UploadFile extends HTMLElement {
  constructor() {
    super();
    this.divContentsInputFile = `divContentsInputFile${Math.floor(Math.random() * 100)}`;
    this.esMultiple = 0;
    this.maxFileCount = 20;
  }

  connectedCallback() {
    this.innerHTML = /*html*/`
    <div id="${this.divContentsInputFile}" class="input-file">
      <span class="elija">
        <svg class="upload"><use xlink:href="#i-upload"></use></svg>
        ${this.getAttribute('ismultiple') ? trans('pulse aquí para seleccionar los archivos') : trans('pulse aquí para seleccionar el archivo')}
      </span>
      <span class="file-labels file-labels-edit"></span>
      <span class="file-labels file-labels-create"></span>
      <input
        type="file"
        title="${trans('archivo') }"
        name="${this.getAttribute('name')}"
        maxfiles="${this.getAttribute('maxfilecount')}"
        id="${this.getAttribute('numid')}"
        class="subir-adjunto"
        accept="${this.getAttribute('accept')}"
        ${this.getAttribute('ismultiple') ? 'multiple' : ''}
      />
    </div>
    `;
    this.maxFileCount = Number(this.getAttribute('maxfilecount')) || this.maxFileCount;
    this.esMultiple = this.getAttribute('ismultiple');

    if (this.getAttribute('editFiles')) {
      this.editarAdjuntos();
    }

    this.subirAdjuntos();
  }

  subirAdjuntos() {
    const inputFile = document.getElementById(this.getAttribute('numid'));
    let listfiles = new DataTransfer();
    let listfiles_temporal = new DataTransfer();
    inputFile.addEventListener('change', () => {

      let file = inputFile.value;
      const fileLabels = document.querySelector(`#${this.divContentsInputFile} .file-labels-create`);


      let total = inputFile.files.length;

      const getNewFileCount = listfiles.files.length + total

      if (getNewFileCount > this.maxFileCount) {
        muestraMsgMain(false, trans('Suba %1 archivos a la vez como máximo', {'%1': this.maxFileCount} ))

        return
      }

      if(!this.esMultiple){
        listfiles = new DataTransfer();
      }

      for (let i = 0; i < total; i++) {
        listfiles.items.add(inputFile.files[i]);
      }

      let fileLabelsContent = this.setFileLabels(listfiles.files);
      fileLabels.innerHTML = fileLabelsContent;

      const filesAdded = document.querySelectorAll('.file-remove');

      let myFileList = listfiles.files;
      inputFile.files = myFileList;

      filesAdded.forEach(fileAdded => {
        fileAdded.addEventListener('click', () => {
          fileAdded.parentNode.parentNode.removeChild(fileAdded.parentNode);
          listfiles_temporal = new DataTransfer();
          listfiles = new DataTransfer();
          let archivo = fileAdded.getAttribute("attrname");
          let total_temp = inputFile.files.length;
          for (let i = 0; i < total_temp; i++) {
            if(inputFile.files[i].name != archivo){
              listfiles_temporal.items.add(inputFile.files[i]);
              listfiles.items.add(inputFile.files[i]);
            }
          }
          let myFileList_temporal = listfiles_temporal.files;
          inputFile.files = myFileList_temporal;

        })
      });


    })
  }

  editarAdjuntos() {
    let files = [];
    if (this.getAttribute('filesToEdit').search("#") >= 0) {
      let filesNames = document.querySelectorAll(this.getAttribute('filesToEdit'));

      filesNames.forEach(fileName => {
        let id = fileName.id.split("idFichero");
        files.push({
          "id": id[1],
          "name": fileName.innerText
        });
      });
    } else {
      files = this.getAttribute('filesToEdit');
    }
    console.log(files);

    const fileLabels = document.querySelector(`#${this.divContentsInputFile} .file-labels-edit`);

    let fileLabelsContent = this.setFileLabels(files);
    fileLabels.innerHTML = fileLabelsContent;

    const filesAdded = document.querySelectorAll('.file-remove');
    filesAdded.forEach((fileAdded, index) => {
      fileAdded.addEventListener('click', () => {
        fileAdded.parentNode.parentNode.removeChild(fileAdded.parentNode);
        document.querySelector(`#${this.divContentsInputFile}`).insertAdjacentHTML('afterbegin', /*html*/`
          <input type="hidden" name="enc_ficheros_deleted[]" value="${files[index].id}" />
        `);
      })
    });
  }

  setFileLabels(files) {
    let filenames = '';
    let fileIcon = '';

    for (let i = 0; i < files.length; i++) {

      const fileType = files[i].name;

      if((/\.(jpe?g|png|gif|svg|bmp|svg|tiff?)$/i).test(fileType)) {
        fileIcon = '<svg><use xlink:href="#i-img"></use></svg>';
      }
      else if((/\.(mpe?g|flv|mov|avi|swf|mp4|mkv|webm|wmv|3gp)$/i).test(fileType)){
        fileIcon = '<svg><use xlink:href="#i-video"></use></svg>';
      }
      else if((/\.(mp3|ogg|wav|wma|amr|aac)$/i).test(fileType)){
        fileIcon = '<svg><use xlink:href="#i-music"></use></svg>';
      }
      else if((/\.(pdf)$/i).test(fileType)){
        fileIcon = '<svg><use xlink:href="#i-pdf"></use></svg>';
      }
      else if((/\.(doc|docm|docx|odt)$/i).test(fileType)){
        fileIcon = '<svg><use xlink:href="#i-word"></use></svg>';
      } else {
        fileIcon = '<svg><use xlink:href="#i-word"></use></svg>'
      }

      filenames += /*html*/`
        <div class="file-label">
          <span class="file-name">
            <span class="file-icon"> ${fileIcon} </span>
            <span class="file-txt"> ${fileType} </span>
          </span>
          <span class="file-remove" attrname="${fileType}"><svg class=""><use xlink:href="#i-trash"></use></svg></span>
        </div>`;
    }
    return filenames;
  }
}

window.customElements.define("upload-file", UploadFile);
