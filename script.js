let totalWaste = 0; // Toplam atık kg
let students = {}; // Öğrenci verileri

// Atık türleri için puanlama
const pointsSorted = {
    plastik: 2,
    cam: 3,
    pil: 6,
    elektronik: 5,
    metal: 4,
    kagit: 2,
    yag: 5,
    tekstil: 2
};

const pointsUnsorted = {
    plastik: 1,
    cam: 1,
    pil: 2,
    elektronik: 2,
    metal: 1,
    kagit: 1,
    yag: 2,
    tekstil: 1
};

// Öğrenci kaydetme fonksiyonu
function registerStudent() {
    const studentName = document.getElementById('studentName').value;
    const studentSurname = document.getElementById('studentSurname').value;
    const studentNumber = document.getElementById('studentNumber').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const studentClass = document.getElementById('studentClass').value;

    if (studentName && studentSurname && studentNumber && studentEmail && studentClass) {
        const studentData = {
            name: studentName,
            surname: studentSurname,
            number: studentNumber,
            email: studentEmail,
            class: studentClass,
            totalPoints: 0,
            wasteEntries: []
        };
        
        students[studentNumber] = studentData; // Öğrenci verisini kaydet
        localStorage.setItem('students', JSON.stringify(students)); // Öğrenci verilerini localStorage'a kaydet
        alert('Öğrenci başarıyla kaydedildi!');
        console.log(students);
    } else {
        alert('Lütfen tüm bilgileri girin!');
    }
}

// Atık veri girişi fonksiyonu
function submitData() {
    const wasteType = document.getElementById('wasteType').value;
    const weight = parseFloat(document.getElementById('wasteWeight').value);
    const sortingStatus = document.getElementById('sortingStatus').value;

    if (!wasteType || isNaN(weight) || !sortingStatus) {
        alert('Lütfen tüm bilgileri doldurun!');
        return;
    }

    let points = 0;
    if (sortingStatus === "sorted") {
        points = weight * (pointsSorted[wasteType] || 0);
    } else if (sortingStatus === "unsorted") {
        points = weight * (pointsUnsorted[wasteType] || 0);
    }

    // Toplam atık sayaç güncelleme
    totalWaste += weight;
    document.getElementById("totalWasteCounter").innerText = `${totalWaste} kg`;

    // Öğrenci verisini güncelleme
    const studentNumber = document.getElementById('studentNumberInput').value;
    if (!students[studentNumber]) {
        alert('Öğrenci bulunamadı!');
        return;
    }

    students[studentNumber].totalPoints += points;
    students[studentNumber].wasteEntries.push({ wasteType, weight, points, sortingStatus });

    // Öğrenci verilerini güncelleme
    localStorage.setItem('students', JSON.stringify(students));
    
    alert(`Veri başarıyla kaydedildi. Kazanılan Puan: ${points}`);
    console.log(students);
}

// Öğrenci verisini görüntüleme fonksiyonu
function viewStudentData() {
    const studentNumber = document.getElementById('viewStudentNumber').value;

    if (!students[studentNumber]) {
        alert('Öğrenci bulunamadı!');
        document.getElementById('studentData').innerHTML = '<p>Öğrenci verisi bulunamadı.</p>';
        return;
    }

    const student = students[studentNumber];
    let studentInfo = `<h3>Öğrenci Numarası: ${studentNumber}</h3>
                       <p><strong>Toplam Puan:</strong> ${student.totalPoints}</p>
                       <p><strong>Atık Girişleri:</strong></p>
                       <ul>`;

    student.wasteEntries.forEach(entry => {
        studentInfo += `<li>
            Tür: ${entry.wasteType}, 
            Miktar: ${entry.weight} kg, 
            Durum: ${entry.sortingStatus === "sorted" ? "Ayrıştırıldı" : "Ayrıştırılmadı"},
            Kazanılan Puan: ${entry.points}
        </li>`;
    });

    studentInfo += `</ul>`;
    document.getElementById('studentData').innerHTML = studentInfo;
}

// Bilgileri değiştirmek için menüleri gösterme fonksiyonu
function showInfo(section) {
    const sections = document.querySelectorAll('.info-section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

// Başlangıçta ilk bilgi gösterme
function initializePage() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    showInfo('ekolojikKredi');
}

initializePage();

// Puan hesaplama ve güncelleme fonksiyonu
function calculatePoints() {
    const studentNumber = document.getElementById('studentNumberInput').value;
    const wasteType = document.getElementById('wasteType').value;
    const wasteWeight = parseFloat(document.getElementById('wasteWeight').value);
    const sortingStatus = document.getElementById('sortingStatus').value;

    if (!students[studentNumber]) {
        alert('Öğrenci bulunamadı!');
        return;
    }

    let points = 0;
    if (sortingStatus === 'sorted') {
        points = wasteWeight * (pointsSorted[wasteType] || 0);
    } else if (sortingStatus === 'unsorted') {
        points = wasteWeight * (pointsUnsorted[wasteType] || 0);
    }

    document.getElementById('pointsDisplay').innerText = `Kazanılan Puan: ${points}`;
}
