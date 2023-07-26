import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { PaintingsResolve } from '@shared/resolve/paintings.resolve';
import { TokenResolve } from '@shared/resolve/token.resolve';
import { PaintingResolve } from '@shared/resolve/painting.resolve';
import { InstagramService } from '@shared/services/instagram.service';
import { PaintingsService } from '@shared/services/paintings.service';

export const routes: Routes = [
  { path: '', pathMatch: "full", loadComponent: () => import('@modules/users/home/pages/home.component').then(m => m.HomeComponent), title: 'Artworks' },
  { path: 'miscellaneous', loadComponent: () => import('@modules/users/miscellaneous/pages/miscellaneous.component').then(m => m.MiscellaneousComponent), title: 'Miscellaneous', resolve: { token: TokenResolve }, providers: [InstagramService] },
  { path: 'about', loadComponent: () => import('@modules/users/about/pages/about.component').then(m => m.AboutComponent), title: 'About' },
  { path: 'contact', loadComponent: () => import('@modules/users/contact/pages/contact.component').then(m => m.ContactComponent), title: 'Contact', resolve: { paintings: PaintingsResolve }, providers: [PaintingsService] },
  { path: 'painting/view/:id', loadComponent: () => import('@modules/users/painting/pages/painting.component').then(m => m.PaintingComponent), resolve: { painting: PaintingResolve }, providers: [PaintingsService] },
  { path: 'admin/create', canActivate: [AuthGuard], loadComponent: () => import('@modules/admin/painting-new/pages/painting-new.component').then(m => m.PaintingNewComponent), title: 'Create New Painting' },
  { path: 'admin/update/:id', canActivate: [AuthGuard], loadComponent: () => import('@modules/admin/painting-update/pages/painting-update.component').then(m => m.PaintingUpdateComponent), title: 'Update Painting', resolve: { painting: PaintingResolve }, providers: [PaintingsService] },
  { path: 'privacypolicy', loadComponent: () => import('@modules/users/privacypolicy/pages/privacypolicy.component').then(m => m.PrivacypolicyComponent), title: 'Privacy Policy' },
  { path: 'refundpolicy', loadComponent: () => import('@modules/users/refundpolicy/pages/refundpolicy.component').then(m => m.RefundpolicyComponent), title: 'Refund Policy' },
  { path: 'termsofservice', loadComponent: () => import('@modules/users/termsofservice/pages/termsofservice.component').then(m => m.TermsofserviceComponent), title: 'Terms Of Service' },
  { path: 'admin', canActivate: [AuthGuard], loadComponent: () => import('@modules/admin/admin/pages/admin.component').then(m => m.AdminComponent), title: 'Administration Panel', resolve: { paintings: PaintingsResolve }, providers: [PaintingsService] },
  { path: 'admin/show/users', canActivate: [AuthGuard], loadComponent: () => import('@modules/admin/users/pages/users.component').then(m => m.UsersComponent), title: 'Registered Users' },
  { path: 'admin/login', loadComponent: () => import('@modules/users/login/pages/login.component').then(m => m.LoginComponent), title: 'Log in' },
  // { path: 'admin/register', loadComponent:()=>import('@modules/users/register/pages/register.component').then(m => m.RegisterComponent), title: 'Register' },
  { path: 'admin/change/portrait/:id', canActivate: [AuthGuard], loadComponent: () => import('@modules/admin/portrait/pages/portrait.component').then(m => m.PortraitComponent), title: 'Change Portrait' },
  // { path: 'admin/save/token', canActivate: [AuthGuard], loadComponent:()=>import('@modules/admin/token-new/pages/token-new.component').then(m => m.TokenNewComponent), title: 'Create New Instagram Token' },
  { path: 'admin/change/token/:id', canActivate: [AuthGuard], loadComponent: () => import('@modules/admin/token-update/pages/token-update.component').then(m => m.TokenUpdateComponent), title: `Refresh Instagram's Token` },
  { path: '404', loadComponent: () => import('@modules/users/error/pages/error.component').then(m => m.ErrorComponent), title: 'Page not found' },
  { path: '**', redirectTo: '/404' }
];