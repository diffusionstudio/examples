import * as core from '@diffusionstudio/core';

export async function main(composition: core.Composition) {
  const text = await composition.add(
    new core.TextClip({
      text: 'Drop mp4/webm in Window',
      position: 'center'
    })
  )

  // Handle the file drop event
  async function handleFileDrop(event: DragEvent): Promise<void> {
    event.preventDefault();

    const files = event.dataTransfer!.files; // FileList object

    if (files.length == 0) return

    const file = files[0];

    text.detach();

    // use file to construct instance
    await composition.add(
      new core.VideoClip(file, {
        height: '100%',
        position: 'center'
      })
    )
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  document.addEventListener('drop', handleFileDrop, false);
  document.addEventListener('dragover', handleDragOver, false);
}
