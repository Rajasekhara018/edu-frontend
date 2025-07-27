import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayeaseThemeService } from '../shared/services/payease-theme-service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  userName: string = "Super Admin";
  loggedInUser: string = "supaeradmin@gmail.com";
  langList = ['en', 'hi', 'es', 'zh', 'ar'];
  constructor(public router: Router, public dailog: MatDialog, public themeService: PayeaseThemeService,
    private zone: NgZone, private http: HttpClient
  ) { }
  // notifications = new Array<NotificationMessage>();
  name!: string;
  userRole!: string;
  image!: string;
  department!: string;
  currentUserId!: string;
  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('userId')!;
    const token = localStorage.getItem('token');
    // if (this.currentUserId) {
    //   // Fetch stored notifications
    //   this.http.get<NotificationMessage[]>(`http://localhost:9000/api/v1/comm/notifications/${this.currentUserId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     })
    //     .subscribe(data => {
    //       this.notifications = data;
    //     });

    //   // Connect to WebSocket
    //   this.notificationService.connect(this.currentUserId, (data) => {
    //     this.notifications.unshift(data); // Push new notification
    //     // Play sound for new notification
    //     debugger
    //     const audio = new Audio('assets/ringtone.mp3');
    //     audio.play().catch(err => console.error('Audio play error:', err));
    //   });
    // }
    // this.loadGoogleTranslate();
    this.name = localStorage.getItem('name')!;
    // this.userRole = JSON.parse(localStorage.getItem('LoggedInUserroles')!);
    // this.image = JSON?.parse(localStorage.getItem('LoggedInUserImage')!);
    // this.department = JSON.parse(localStorage.getItem('LoggedInUserDepartment')!);
    const roles = localStorage.getItem('LoggedInUserroles');
    this.userRole = roles && roles !== 'undefined' ? JSON.parse(roles) : [];
    const imageData = localStorage.getItem('LoggedInUserImage');
    this.image = imageData && imageData !== 'undefined' ? JSON.parse(imageData) : null;
    const departmentData = localStorage.getItem('LoggedInUserDepartment');
    this.department = departmentData && departmentData !== 'undefined' ? JSON.parse(departmentData) : null;
  }
  ngOnDestroy(): void {
    // this.notificationService.disconnect();
  }

  // loadGoogleTranslate() {
  //   const scriptId = 'google-translate-script';
  //   if (!document.getElementById(scriptId)) {
  //     const script = document.createElement('script');
  //     script.id = scriptId;
  //     script.type = 'text/javascript';
  //     script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  //     document.body.appendChild(script);
  //   }

  //   (window as any).googleTranslateElementInit = () => {
  //     new google.translate.TranslateElement({
  //       pageLanguage: 'en',
  //       includedLanguages: 'en,hi,te,kn,ta,ml,fr,de,es,zh-CN',
  //       layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  //     }, 'google_translate_element');
  //   };
  // }

  gotoHome() {
    this.router.navigate(['home']);
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  changeTheme(themeType: string) {
    localStorage.setItem('appTheme', themeType);
    this.themeService.switchTheme(themeType.toLowerCase());
  }
  changePassword() {

  }
  psdChange() {

  }
  userProfile() {

  }
  // addUser() {
  //   let dailogData: any;
  //   dailogData = this.dailog.open(UserComponent, {
  //     width: '896px',
  //     height: '550px'
  //   });
  // }

  // fileUpload() {
  //   let dailogData: any;
  //   dailogData = this.dailog.open(FileUploadComponent, {
  //     width: '450px',
  //     height: '450px'
  //   });
  // }

  // notifications = [
  //   { message: 'New approval request for Q4 Financial Report', time: '2 minutes ago' },
  //   { message: 'Document "Marketing Strategy" was uploaded', time: '1 hour ago' },
  //   { message: 'Employee Handbook was approved', time: '2 hours ago' },
  //   { message: 'New approval request for Q4 Financial Report', time: '2 minutes ago' },
  //   { message: 'Document "Marketing Strategy" was uploaded', time: '1 hour ago' },
  //   { message: 'Employee Handbook was approved', time: '2 hours ago' }
  // ];

  user = {
    name: 'Sarah Johnson',
    role: 'Admin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  };


  showNotif = false;
  showProfile = false;

  toggleNotif() {
    this.showNotif = !this.showNotif;
    this.showProfile = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotif = false;
  }

  // logout() {
  //   console.log('Logged out');
  //   // Add real logout logic
  // }

  closeNotif() {
    this.showNotif = false;
  }
}
