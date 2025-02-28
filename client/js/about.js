  
        function typeWriter(element, fullText, index, callback) {
            if (index < fullText.length) {
                element.innerHTML = fullText.substring(0, index + 1);
                index++;
                setTimeout(function() {
                    typeWriter(element, fullText, index, callback);
                }, Math.random() * (150 - 50) + 50); 
            } else {
                callback();
            }
        }

        
        const cards = document.querySelectorAll('.help-card');
        cards.forEach(card => {
            const readMore = card.querySelector('.read-more');
            const paragraphs = card.querySelectorAll('p');
            const firstParagraph = paragraphs[0];
            const fullText = firstParagraph.innerText; 
            const truncatedText = fullText.substring(0, 20); 

            firstParagraph.innerText = truncatedText; 

            readMore.addEventListener('click', function() {
                this.style.display = 'none'; 
                typeWriter(firstParagraph, fullText, 20, function() {
                    
                });
            });
        });