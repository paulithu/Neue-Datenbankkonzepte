    const form = document.querySelector('form');
      const successMessage = document.querySelector('.success-message');
      const filesDiv = document.querySelector('.files');

      
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const response = await fetch('http://localhost:3001/api/uploadFile', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.fileIds.length > 0) {
          successMessage.innerHTML = 'Datei wurde erfolgreich hochgeladen';
          successMessage.style.display = 'block';
          updateFiles(data.fileIds);
          location.reload(); // Seite wird neu geladen
        }
      });

      //Update der Seite nach einer CRUD-Method
      function updateFiles(fileIds) {
        filesDiv.innerHTML = '';
        fileIds.forEach((fileId) => {
          const fileContainer = document.createElement('li');
          const link = document.createElement('a');
          link.classList.add('download-link');
          link.setAttribute('href', `/downloadFile/${fileId}`);
          link.innerText = `File ${fileId}`;

          // Erstellt einen Download Button
          const downloadBtn = document.createElement('button');
          downloadBtn.classList.add('download-button');
          downloadBtn.innerText = 'Download';
          downloadBtn.addEventListener('click', async () => {
            const response = await fetch(
              `http://localhost:3001/api/downloadFile/${fileId}`
            );
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Download Link wird erstellt
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', url);
            downloadLink.setAttribute('download', '');
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          });

          // Vererbung von Download Button, Delete Button, und Download Link
          fileContainer.appendChild(link);
          fileContainer.appendChild(downloadBtn);
          fileContainer.appendChild(deleteBtn);

          // Vererbt Dateicontainer zur Dateiliste
          document.getElementById('file-list').appendChild(fileContainer);
        });
        location.reload(); // Seite wird neu geladen
      }

      // Alle Dateien werden abgerufen und angezeigt
      fetch('http://localhost:3001/api/getfiles')
        .then((response) => response.json())
        .then((data) => {
          const fileList = document.getElementById('file-list');
          data.forEach((file) => {
            const listItem = document.createElement('li');
            const fileLink = document.createElement('a');
            // Download Link wird erstellt anhand der FileId
            fileLink.href = `http://localhost:3001/api/downloadFile/${file._id}`;
            fileLink.innerText = file.filename;
            fileLink.addEventListener('click', (event) => {
              event.preventDefault();
              window.open(fileLink.href, '_blank');
            });
            listItem.appendChild(fileLink);

            // Div Block wird erstellt mit den Icons darin
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon-div';
            listItem.appendChild(iconDiv);

            // Löschen Icon hinzufügen
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt icon'; // Icon für Löschenbutton
            deleteIcon.addEventListener('click', (event) => {
              event.preventDefault();
              // Löschen Link wird erstellt anhand der FileId
              fetch(`http://localhost:3001/api/deleteFile/${file._id}`, {
                method: 'DELETE',
              })
                .then((response) => {
                  listItem.remove();
                })
                .catch((error) => console.error(error));
              location.reload(); // Seite wird neu geladen
            });
            iconDiv.appendChild(deleteIcon);

            // Download Icon wird hinzugefügt
            const downloadIcon = document.createElement('i');
            downloadIcon.className = 'fas fa-download icon'; // Icon für Downloadbutton
            downloadIcon.addEventListener('click', (event) => {
              event.preventDefault();
              window.open(fileLink.href, '_blank');
            });
            iconDiv.appendChild(downloadIcon);

            fileList.appendChild(listItem);
          });
        })
        .catch((error) => console.error(error));