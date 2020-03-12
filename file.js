document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.custom-file input').addEventListener('change', function (e) {
    let filesName = [];
    for (let i = 0; i < $(this)[0].files.length; i++) {
        filesName.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(filesName.join(', '));
  });

  let simpleFileForm = document.querySelector('.simple-files-upload');
  let previewBlock = document.querySelector('.simple-files-preview');

  const getData = async(url) => {
    let fetchResponse = await fetch(url);

    return await fetchResponse.json();
  };

  const postData = async(url, fData) => {
    let fetchResponse = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      body: fData,
    });

    return await fetchResponse.json();
  };

  const deleteData = async(url, fData) => {
    let fetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'cors',
      cache: 'no-cache',
      body: fData,
    });

    return await fetchResponse.json();
  };

  getData('fileWorker.php')
    .then(fetchResponse => {
      let filesList = fetchResponse.data.filesList;
      console.log(fetchResponse);
      for (var item in filesList) {
        console.log(filesList[ item ]);
        previewBlock.append(createPreviewItem(filesList[item].fileType, filesList[item].fileInfo, filesList[item].fileName));
      }
    })
    .catch(fetchResponse => {
      previewBlock.append(createNothingItem());
    });

  let filesUpload = document.querySelector('.simple-files-upload .files-upload');
  filesUpload.addEventListener('change', uploadFiles(filesUpload.files));

  simpleFileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    uploadFiles(filesUpload.files);
  }, { passive: false });
  document.querySelector('.btn-files-upload').addEventListener('click', () => { simpleFileForm.submit(); });

  let dropbox = document.querySelector('.container-dragndrop');
  dropbox.addEventListener('dragenter', dragenter, false);
  dropbox.addEventListener('dragover', dragover, false);
  dropbox.addEventListener('drop', drop, false);

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    let dt = e.dataTransfer;
    let files = dt.files;

    uploadFiles(files);
  }

  function uploadFiles(files) {
    let adjustedFilesLength = files.length;

    if (adjustedFilesLength === 0) { return }

    document.querySelector('.simple-files-preview .nothing-files').classList.toggle('d-none');

    for (let i = 0; i < adjustedFilesLength; i++) {
      processFile(files[i]);
    }
  }

  function processFile(file) {
    file.uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      let fData = new FormData();
      fData.set('filesUpload', file);

      postData('fileWorker.php', fData)
        .then(fetchResponse => {
          previewBlock.append(createPreviewItem(file.type, fetchResponse.data, file.name));
        })
        .catch(fetchResponse => console.log(fetchResponse.data.message, fetchResponse.data.fullText))
        .finally(() => {
          document.querySelector('.simple-files-upload').reset();
        });
    }
  }

  function createNothingItem() {
    let nothingItem = document.createElement('p');
    nothingItem.classList.add('nothing-files');
    nothingItem.text = 'Не загружено ни одного файла';

    return nothingItem;
  }

  function createPreviewItem(fileType, uploadFileData, fileName) {
    let fileExt = 'text';
    if (fileType.match('image/*')) {
      fileExt = 'image';
    } else if (fileType.match('video/*')) {
      fileExt = 'video';
    } else if (fileType.match('audio/*')) {
      fileExt = 'audio';
    } else if (fileType.match('application/pdf')) {
      fileExt = 'pdf';
    }

    let previewItem = document.createElement('div');
    previewItem.classList.add('preview-item');
    previewItem.append(createItemIcon(fileExt));
    previewItem.append(createItemLink(uploadFileData, fileName));
    previewItem.append(createItemButton());
    previewItem.id = uploadFileData.newFileHash;

    return previewItem;
  }

  function createGlyphIcon(iconType, gliphType = 'file') {
    let typeClass = (gliphType !== '') ? `fa-${gliphType}-${iconType}-o` : `fa-${iconType}`;
    let faType = (gliphType !== '') ? 'key' : 'fw';

    let glyphIcon = document.createElement('i');
    glyphIcon.classList.add('fa', `fa-${faType}`);
    glyphIcon.classList.add(typeClass);
    glyphIcon.setAttribute('aria-hidden', 'true');

    return glyphIcon;
  }

  function createItemIcon(iconType = 'text') {
    let itemIcon = document.createElement('span');
    itemIcon.classList.add('item-icon', 'mr-3');
    itemIcon.append(createGlyphIcon(iconType));

    return itemIcon;
  }

  function createItemLink(uploadFileData, fileName) {
    let itemLink = document.createElement('a');
    itemLink.classList.add('item-link');
    itemLink.setAttribute('target', '_blank');
    itemLink.href = uploadFileData.newFileLink;
    itemLink.text = fileName;

    return itemLink;
  }

  function createItemButton(btnType = 'delete') {
    let itemButton = document.createElement('span');
    itemButton.classList.add('badge', 'badge-danger', 'float-right', 'mt-1', `item-${btnType}`);
    itemButton.append(createGlyphIcon('times', ''));

    itemButton.addEventListener('click', function(event) {
      let parent = event.target.closest('.preview-item');
      let linkDeletedFile = parent.querySelector('.item-link').text;
      deleteFile(parent.id, linkDeletedFile);
    });

    return itemButton;
  }

  function deleteFile(fileHash, fileName) {
    let dDate = 'data=' + JSON.stringify({needDelete : true, fileName : `${fileHash}_${fileName}`});

    deleteData('fileWorker.php', dDate)
      .then(fetchResponse => {
        console.log(fetchResponse);
        document.querySelector(`#${fileHash}`).remove();
      })
      .catch(fetchResponse => console.log(fetchResponse));
  }
});