document.addEventListener('DOMContentLoaded', function() {

    setTimeout(function() {
        const loadingScreen = document.querySelector('.loading-screen');
        const content = document.querySelector('.content');

        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            content.style.opacity = '1';
            content.classList.remove('hidden');
        }, 1000);
    }, 2000);

    const gallery = document.querySelector('.gallery');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    let touchStartX = 0;
    let allowSwipe = true; // Biến kiểm soát vuốt

    // Lấy danh sách các ảnh từ thư mục "images"
    fetch('./images.json')
        .then(response => response.json())
        .then(data => {
            data.forEach((img, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = `images/${img}`;
                imgElement.alt = img;
                imgElement.addEventListener('click', () => openModal(img, index));
                gallery.appendChild(imgElement);
            });
        });

    let currentIndex = 0;

    function openModal(imgName, index) {
        modal.style.display = 'block';
        modalImg.src = `images/${imgName}`;
        captionText.innerHTML = imgName;
        currentIndex = index;
        allowSwipe = true; // Đặt lại biến kiểm soát khi mở modal
    }

    const closeModal = document.getElementById('close');
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    document.addEventListener('keydown', function(event) {
        if (modal.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                showPrevious();
            } else if (event.key === 'ArrowRight') {
                showNext();
            }
        }
    });

    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = gallery.children.length - 1;
        }
        const img = gallery.children[currentIndex];
        openModal(img.alt, currentIndex);
    }

    function showNext() {
        if (currentIndex < gallery.children.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        const img = gallery.children[currentIndex];
        openModal(img.alt, currentIndex);
    }

    modal.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
        allowSwipe = true; // Bắt đầu cuộc vuốt
    });

    modal.addEventListener('touchmove', function(event) {
        if (!allowSwipe) return; // Nếu không được phép vuốt, thoát
        let touchEndX = event.touches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            showNext();
            allowSwipe = false; // Chỉ cho phép vuốt một lần
        } else if (touchEndX - touchStartX > 50) {
            showPrevious();
            allowSwipe = false; // Chỉ cho phép vuốt một lần
        }
    });

    modal.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
    });
    
    modal.addEventListener('touchend', function(event) {
        let touchEndX = event.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            showNext();
        } else if (touchEndX - touchStartX > 50) {
            showPrevious();
        }
    });
});
