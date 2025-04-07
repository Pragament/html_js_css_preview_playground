$('#mySelect').select2({
    placeholder: "Search and Learn...",
    ajax: {
        url: 'https://staticapis.pragament.com/online_courses/freecodecamp-html.json',
        dataType: 'json',
        delay: 250,
        processResults: function (data, params) {
            let searchTerm = params.term ? params.term.toLowerCase() : '';
            let results = [];
            if (data && data.chapters && Array.isArray(data.chapters)) {
                data.chapters.forEach(chapter => {
                    if (chapter && chapter.name) {
                        let chapterData = {
                            id: chapter.id,
                            text: chapter.name,
                            dashedName: chapter.dashedName,
                            children: []
                        };

                        if (chapter.topics && Array.isArray(chapter.topics)) {
                            chapter.topics.forEach(topic => {
                                if (topic && topic.title && topic.title.toLowerCase().includes(searchTerm)) {
                                    chapterData.children.push({
                                        id: topic.id,
                                        text: topic.title,
                                        dashedName: chapter.dashedName
                                    });
                                }
                            });
                        }

                        if (chapter.name.toLowerCase().includes(searchTerm) || chapterData.children.length > 0) {
                            results.push(chapterData);
                        }
                    }
                });
            }

            return {
                results: results
            };
        },
        cache: true
    },
    minimumInputLength: 0,
    templateResult: function (data) {
        if (data.children) {
            return $('<span><b>' + data.text + '</b></span>');
        }
        return data.text;
    }
});

$(document).ready(function() {
    let isResizing = false;
    let startX;
    let startWidth;

    $('.resize-handle').on('mousedown', function(e) {
        isResizing = true;
        startX = e.pageX;
        startWidth = $('.container').width();
        e.preventDefault();
    });

    $(document).on('mousemove', function(e) {
        if (!isResizing) return;
        const newWidth = startWidth + (e.pageX - startX);
        $('.container').width(newWidth);
    });

    $(document).on('mouseup', function() {
        isResizing = false;
    });

    $('#mySelect').on('select2:select', function (e) {
        var selectedData = e.params.data;
        var dashedName = selectedData.dashedName;
        var id = selectedData.id;

        if (!dashedName || !id) {
            $('.message-box').text('Error: dashedName or id not found.');
            return;
        }

        let markdownUrl = `https://raw.githubusercontent.com/freeCodeCamp/freeCodeCamp/refs/heads/main/curriculum/challenges/english/25-front-end-development/${dashedName}/${id}.md`;

        fetch(markdownUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(markdownText => {
                const transcript = extractTranscript(markdownText);
                if (transcript) {
                    // Parse only the transcript section
                    $('.message-box').html(marked.parse(transcript));

                    // Highlight code blocks within the transcript and add copy buttons
                    document.querySelectorAll('.message-box pre code').forEach(block => {
                        hljs.highlightElement(block);
                        const copyButton = document.createElement('button');
                        copyButton.textContent = 'Copy Code';
                        copyButton.className = 'copy-code-button';
                        block.parentNode.insertBefore(copyButton, block);

                        copyButton.addEventListener('click', () => {
                            copyCodeToEditor(block.textContent);
                        });
                    });
                } else {
                    $('.message-box').text('Transcript not found.');
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                $('.message-box').text('Error loading content.');
            });
    });

    function extractTranscript(markdown) {
        const transcriptStart = markdown.indexOf('--transcript--');
        if (transcriptStart === -1) {
            return null;
        }

        const transcriptContentStart = transcriptStart + '--transcript--'.length;
        const nextDelimiter = markdown.indexOf('--', transcriptContentStart);
        const transcriptEnd = nextDelimiter === -1 ? markdown.length : nextDelimiter;

        return markdown.substring(transcriptContentStart, transcriptEnd).trim();
    }

    function copyCodeToEditor(code) {
        const activeEditor = getActiveEditor();
        if (activeEditor) {
            activeEditor.replaceSelection(code);
        }
    }
});